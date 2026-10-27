using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows.Forms;

static class Win {
    [StructLayout(LayoutKind.Sequential)] public struct Rect { public int L,T,R,B; public int Width {get{return R-L;}} public int Height {get{return B-T;}} }
    [DllImport("user32.dll",CharSet=CharSet.Unicode)] public static extern IntPtr FindWindow(string cls,string name);
    [DllImport("user32.dll",CharSet=CharSet.Unicode)] public static extern IntPtr FindWindowEx(IntPtr parent,IntPtr after,string cls,string name);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h,out Rect r);
    [DllImport("user32.dll")] public static extern bool IsWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern IntPtr GetParent(IntPtr h);
    [DllImport("user32.dll",SetLastError=true)] public static extern IntPtr SetParent(IntPtr h,IntPtr p);
    [DllImport("user32.dll",EntryPoint="GetWindowLongPtrW")] public static extern IntPtr GetStyle(IntPtr h,int n);
    [DllImport("user32.dll",EntryPoint="SetWindowLongPtrW")] public static extern IntPtr SetStyle(IntPtr h,int n,IntPtr v);
    [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h,int x,int y,int w,int height,bool repaint);
    [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr h,uint m,IntPtr w,IntPtr l);
    [DllImport("user32.dll")] public static extern uint GetDpiForWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern IntPtr GetWindowDpiAwarenessContext(IntPtr h);
    [DllImport("user32.dll")] public static extern IntPtr SetThreadDpiAwarenessContext(IntPtr context);
    [DllImport("user32.dll")] public static extern bool AreDpiAwarenessContextsEqual(IntPtr first,IntPtr second);
    public static Rect Bounds(IntPtr h){Rect r;if(!GetWindowRect(h,out r))throw new Exception("taskbar-unavailable");return r;}
    public static void Relayout(IntPtr shell){if(IsWindow(shell))PostMessage(shell,5,IntPtr.Zero,IntPtr.Zero);}
}

// RtlGetVersion is independent of compatibility manifests. Unknown versions fail closed.
static class WindowsShell {
    [StructLayout(LayoutKind.Sequential,CharSet=CharSet.Unicode)] struct VersionInfo {
        public uint Size,Major,Minor,Build,Platform;
        [MarshalAs(UnmanagedType.ByValTStr,SizeConst=128)] public string ServicePack;
    }
    [DllImport("ntdll.dll",CharSet=CharSet.Unicode)] static extern int RtlGetVersion(ref VersionInfo version);
    internal static bool SupportsVersion(uint major,uint minor,uint build){return major==10&&minor==0&&build>=10240&&build<22000;}
    internal static bool IsSupported(){
        try{var version=new VersionInfo();version.Size=(uint)Marshal.SizeOf(typeof(VersionInfo));return RtlGetVersion(ref version)==0&&SupportsVersion(version.Major,version.Minor,version.Build);}catch{return false;}
    }
}

static class Program {
    internal static readonly JavaScriptSerializer Json=new JavaScriptSerializer {MaxJsonLength=16384};
    internal static void Emit(object o){lock(Json){Console.WriteLine(Json.Serialize(o));Console.Out.Flush();}}
    [STAThread] static void Main(string[] args){
        Console.InputEncoding=new UTF8Encoding(false);Console.OutputEncoding=new UTF8Encoding(false);
        if(args.Length==1 && args[0]=="--startup-query"){
            using(var key=Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Run"))Program.Emit(new {command=key==null?null:key.GetValue("Cypher") as string});return;
        }
        if(!WindowsShell.IsSupported()){Emit(new {type="error",code="taskbar-unsupported-os"});return;}
        if(args.Length==3 && args[0]=="--watch"){
            try{Process.GetProcessById(int.Parse(args[1])).WaitForExit();}catch(ArgumentException){}
            Win.Relayout(new IntPtr(long.Parse(args[2])));return;
        }
        bool owner;using(var mutex=new Mutex(true,"Local\\Cypher.Taskbar.Surface",out owner)){
            if(!owner){Emit(new {type="error",code="taskbar-busy"});return;}
            try{
                var shell=Win.FindWindow("Shell_TrayWnd",null);
                if(shell==IntPtr.Zero)throw new Exception("taskbar-unavailable");
                Win.SetThreadDpiAwarenessContext(Win.GetWindowDpiAwarenessContext(shell));
                Application.EnableVisualStyles();Application.SetCompatibleTextRenderingDefault(false);
                using(var form=new Surface(shell))Application.Run(form);
            }catch(Exception){Emit(new {type="error",code="taskbar-unavailable"});}
        }
    }
}

sealed class Surface:Form {
    IntPtr shell,rebar,tasks;int reserve;bool attached,closing;Win.Rect original;readonly System.Windows.Forms.Timer timer=new System.Windows.Forms.Timer();
    sealed class DisplayItem {public string Provider,Text;public bool Stale;public List<string> Quotas=new List<string>();}
    readonly Dictionary<string,Image> logos=new Dictionary<string,Image>();
    readonly ToolTip tip=new ToolTip();readonly List<DisplayItem> displayItems=new List<DisplayItem>();int extraCount;string language="fr";
    public Surface(IntPtr h){
        shell=h;Text="Cypher Taskbar";FormBorderStyle=FormBorderStyle.None;ShowInTaskbar=false;StartPosition=FormStartPosition.Manual;AutoScaleMode=AutoScaleMode.None;
        BackColor=Color.FromArgb(30,30,30);ForeColor=Color.White;Cursor=Cursors.Hand;AccessibleName="Cypher quotas";DoubleBuffered=true;Font=new Font("Segoe UI",9f,FontStyle.Regular,GraphicsUnit.Point);
        foreach(string resource in typeof(Surface).Assembly.GetManifestResourceNames()){if(!resource.StartsWith("Cypher.Logos.")||!resource.EndsWith(".png"))continue;string name=resource.Substring(13,resource.Length-17);using(var stream=typeof(Surface).Assembly.GetManifestResourceStream(resource))using(var image=Image.FromStream(stream))logos[name]=new Bitmap(image);}
        foreach(var alias in new Dictionary<string,string>{{"chatgpt","openai"},{"lechat","mistral"},{"deepseek-chat","deepseek"},{"google-ai","googleai"}})if(logos.ContainsKey(alias.Value))logos[alias.Key]=new Bitmap(logos[alias.Value]);
        timer.Interval=200;timer.Tick+=(s,e)=>{try{LayoutSurface();}catch{Fail("taskbar-unavailable");}};
    }
    protected override bool ShowWithoutActivation {get{return true;}}
    protected override void OnLoad(EventArgs e){
        base.OnLoad(e);
        try{
            rebar=Win.FindWindowEx(shell,IntPtr.Zero,"ReBarWindow32",null);tasks=Win.FindWindowEx(rebar,IntPtr.Zero,"MSTaskSwWClass",null);
            if(rebar==IntPtr.Zero||tasks==IntPtr.Zero)throw new Exception();
            original=Win.Bounds(rebar);var bar=Win.Bounds(shell);if(bar.Width<bar.Height)throw new Exception();
            reserve=ReservedWidth(Win.GetDpiForWindow(shell));if(original.Width-reserve<300)throw new Exception();
            // A separate watchdog survives an abrupt helper/Electron termination.
            var watch=new ProcessStartInfo(Application.ExecutablePath,"--watch "+Process.GetCurrentProcess().Id+" "+shell.ToInt64()) {UseShellExecute=false,CreateNoWindow=true,WindowStyle=ProcessWindowStyle.Hidden};
            using(var process=Process.Start(watch)){if(process==null)throw new Exception();}
            Win.SetStyle(Handle,-16,new IntPtr((Win.GetStyle(Handle,-16).ToInt64()&~0x80000000L)|0x40000000L));
            Win.SetParent(Handle,shell);if(Win.GetParent(Handle)!=shell)throw new Exception();
            attached=true;LayoutSurface();timer.Start();
            bool sameDpi=Win.AreDpiAwarenessContextsEqual(Win.GetWindowDpiAwarenessContext(Handle),Win.GetWindowDpiAwarenessContext(shell));if(!sameDpi)throw new Exception();
            Program.Emit(new {type="ready",hwnd=Handle.ToInt64(),dpi=Win.GetDpiForWindow(Handle),dpiContextMatches=sameDpi});
            var reader=new Thread(ReadInput){IsBackground=true};reader.Start();
        }catch{Fail("taskbar-unavailable");}
    }
    void LayoutSurface(){
        if(!Win.IsWindow(shell)||!Win.IsWindow(rebar)||!Win.IsWindow(tasks)||Win.GetParent(Handle)!=shell)throw new Exception();
        var bar=Win.Bounds(shell);if(bar.Width<bar.Height)throw new Exception();
        var current=Win.Bounds(rebar);int dpi=(int)Win.GetDpiForWindow(shell);reserve=ReservedWidth((uint)dpi);
        // Explorer owns the natural right edge. Weather/notification children bound it.
        int right=bar.R;
        foreach(string cls in new[]{"DynamicContent2","TrayNotifyWnd"}){
            var child=Win.FindWindowEx(shell,IntPtr.Zero,cls,null);
            if(child!=IntPtr.Zero){var b=Win.Bounds(child);if(b.Width>0&&b.L>current.L)right=Math.Min(right,b.L);}
        }
        // The shell leaves a small gap before its weather control. Keep that gap.
        right-=2;int width=right-current.L-reserve;
        if(width<300||bar.Height>200*dpi/96)throw new Exception();
        if(current.Width!=width)Win.MoveWindow(rebar,current.L-bar.L,current.T-bar.T,width,current.Height,true);
        var after=Win.Bounds(rebar);var task=Win.Bounds(tasks);
        if(after.R>right-reserve||task.R>right-reserve)throw new Exception();
        // Poll Explorer geometry without forcing a move/repaint of an idle taskbar.
        var surface=Win.Bounds(Handle);
        if(surface.L!=right-reserve||surface.T!=bar.T||surface.Width!=reserve||surface.Height!=bar.Height)
            Win.MoveWindow(Handle,right-reserve-bar.L,0,reserve,bar.Height,true);
    }
    int ReservedWidth(uint dpi){return (int)Math.Round((8+Math.Max(1,displayItems.Count)*72+(extraCount>0?24:0))*dpi/96.0);}
    static string SafePercent(object value){var text=Convert.ToString(value);return System.Text.RegularExpressions.Regex.IsMatch(text,@"^(100|\d{1,2})%$")?text:"—";}
    string QuotaText(Dictionary<string,object> quota){
        string label=Convert.ToString(quota["label"]);if(!System.Text.RegularExpressions.Regex.IsMatch(label,@"^(session|weekly|quota|\d{1,6}[mhd])$"))label="quota";
        if(label=="session")label=language=="fr"?"sess.":"sess.";else if(label=="weekly")label=language=="fr"?"sem.":"week";else if(language=="fr"&&label.EndsWith("d"))label=label.Substring(0,label.Length-1)+"j";
        return label+" "+SafePercent(quota["text"]);
    }
    void ReadInput(){
        try{string line;while((line=Console.ReadLine())!=null){
            if(line.Length>16384)break;
            var msg=Program.Json.Deserialize<Dictionary<string,object>>(line);
            if(msg==null||!msg.ContainsKey("type"))break;
            if((string)msg["type"]=="quit")break;
            if((string)msg["type"]!="render")break;
            var captured=msg;BeginInvoke((Action)(()=>Render(captured)));
        }}catch{}finally{if(!closing)try{BeginInvoke((Action)(()=>Close()));}catch{}}
    }
    void Render(Dictionary<string,object> msg){
        try{
            language=msg.ContainsKey("language")&& (string)msg["language"]=="en"?"en":"fr";
            var values=msg["items"] as ArrayList;var labels=new List<string>();displayItems.Clear();
            if(values!=null)foreach(Dictionary<string,object> item in values){
                if(displayItems.Count==3)break;
                string provider=Convert.ToString(item["providerId"]);
                string text=SafePercent(item["text"]);
                bool old=item.ContainsKey("stale")&&item["stale"] is bool&&(bool)item["stale"];
                var reading=new DisplayItem {Provider=provider,Text=text,Stale=old};
                var quotas=item.ContainsKey("quotas")?item["quotas"] as ArrayList:null;
                if(quotas!=null)foreach(Dictionary<string,object> quota in quotas){if(reading.Quotas.Count==2)break;reading.Quotas.Add(QuotaText(quota));}
                if(quotas!=null&&quotas.Count==1){var q=(Dictionary<string,object>)quotas[0];var label=Convert.ToString(q["label"]);if(label=="weekly"||label=="7d")reading.Quotas.Insert(0,"—");}
                displayItems.Add(reading);labels.Add(Convert.ToString(item["label"])+" : "+(reading.Quotas.Count>0?string.Join(" / ",reading.Quotas.ToArray()):text)+(old?" (ancien / stale)":""));
            }
            extraCount=msg.ContainsKey("extraCount")?Math.Max(0,Convert.ToInt32(msg["extraCount"])):0;
            string caption=language=="fr"?"Cypher — pourcentages restants\n":"Cypher — remaining percentages\n";
            string tooltip=caption+string.Join("\n",labels.ToArray())+"\n"+(language=="fr"?"Cliquer pour ouvrir Cypher":"Click to open Cypher");
            tip.SetToolTip(this,tooltip.Length>1800?tooltip.Substring(0,1800):tooltip);AccessibleDescription=tooltip;if(attached)LayoutSurface();Invalidate();
        }catch{Fail("taskbar-protocol");}
    }
    protected override void OnPaint(PaintEventArgs e){
        base.OnPaint(e);
        if(displayItems.Count==0){TextRenderer.DrawText(e.Graphics,"Cypher  —",Font,ClientRectangle,ForeColor,TextFormatFlags.HorizontalCenter|TextFormatFlags.VerticalCenter);return;}
        float scale=Win.GetDpiForWindow(Handle)/96f;int padding=(int)Math.Round(4*scale),iconSize=(int)Math.Round(16*scale),gap=(int)Math.Round(4*scale);
        var flags=TextFormatFlags.VerticalCenter|TextFormatFlags.SingleLine|TextFormatFlags.EndEllipsis|TextFormatFlags.NoPrefix|TextFormatFlags.NoPadding;
        string extra=extraCount>0?"+"+extraCount:"";int extraWidth=extra.Length>0?TextRenderer.MeasureText(e.Graphics,extra,Font,Size.Empty,flags).Width+gap:0;
        int cell=(ClientSize.Width-2*padding-extraWidth)/displayItems.Count;
        e.Graphics.InterpolationMode=System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;e.Graphics.PixelOffsetMode=System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
        for(int i=0;i<displayItems.Count;i++){
            var item=displayItems[i];int x=padding+i*cell;Image logo;if(!logos.TryGetValue(item.Provider,out logo))logo=logos["default"];
            e.Graphics.DrawImage(logo,new Rectangle(x,(ClientSize.Height-iconSize)/2,iconSize,iconSize));
            var color=item.Stale?Color.FromArgb(255,202,110):ForeColor;
            int numberX=x+iconSize+gap,numberWidth=Math.Max(1,cell-iconSize-gap);
            if(item.Quotas.Count>0){
                int rowHeight=Math.Min((int)Math.Round(15*scale),ClientSize.Height/2),top=(ClientSize.Height-rowHeight*2)/2;
                using(var quotaFont=new Font("Segoe UI",8f,FontStyle.Regular,GraphicsUnit.Point))for(int row=0;row<2;row++){
                    string line=row<item.Quotas.Count?item.Quotas[row]:"—";
                    var match=System.Text.RegularExpressions.Regex.Match(line,@"(\d{1,3})%$");int remaining=match.Success?int.Parse(match.Groups[1].Value):101;
                    var rowColor=item.Stale?color:remaining<=5?Color.FromArgb(255,135,135):remaining<=20?Color.FromArgb(255,210,100):color;
                    TextRenderer.DrawText(e.Graphics,line,quotaFont,new Rectangle(numberX,top+row*rowHeight,numberWidth,rowHeight),rowColor,flags);
                }
            }else TextRenderer.DrawText(e.Graphics,item.Text,Font,new Rectangle(numberX,0,numberWidth,ClientSize.Height),color,flags);
            if(item.Stale)e.Graphics.FillEllipse(Brushes.Goldenrod,new Rectangle(x+iconSize-(int)(4*scale),(ClientSize.Height+iconSize)/2-(int)(4*scale),(int)(4*scale),(int)(4*scale)));
        }
        if(extraWidth>0)TextRenderer.DrawText(e.Graphics,extra,Font,new Rectangle(ClientSize.Width-padding-extraWidth,0,extraWidth,ClientSize.Height),ForeColor,flags);
    }
    protected override void OnMouseUp(MouseEventArgs e){base.OnMouseUp(e);if(e.Button==MouseButtons.Left)Program.Emit(new {type="open"});}
    void Fail(string code){Program.Emit(new {type="error",code=code});Close();}
    protected override void OnFormClosed(FormClosedEventArgs e){closing=true;timer.Stop();timer.Dispose();tip.Dispose();foreach(var logo in logos.Values)logo.Dispose();if(attached)Win.Relayout(shell);base.OnFormClosed(e);}
}
