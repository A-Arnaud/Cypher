// A staged Windows desktop, painted in a native WinForms harness.
// Cypher's indicator is the actual production Surface painter. No Explorer attachment.
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Reflection;
using System.Windows.Forms;

sealed class WindowsScene:Form {
    readonly Image panel,indicator,icon;readonly bool showPanel,dark;
    public WindowsScene(string screenshot,Image reading,Image appIcon,bool visiblePanel,bool darkPanel){
        ClientSize=new Size(1600,1000);FormBorderStyle=FormBorderStyle.None;ShowInTaskbar=false;AutoScaleMode=AutoScaleMode.None;
        panel=Image.FromFile(screenshot);indicator=reading;icon=appIcon;showPanel=visiblePanel;dark=darkPanel;
    }
    void TextAt(Graphics g,string text,int x,int y,int size,Color color,bool bold=false){
        using(var font=new Font("Segoe UI",size,bold?FontStyle.Bold:FontStyle.Regular,GraphicsUnit.Pixel))
            TextRenderer.DrawText(g,text,font,new Point(x,y),color,TextFormatFlags.NoPadding|TextFormatFlags.NoPrefix);
    }
    protected override void OnPaint(PaintEventArgs e){
        var g=e.Graphics;g.SmoothingMode=SmoothingMode.AntiAlias;
        using(var wallpaper=new LinearGradientBrush(ClientRectangle,dark?Color.FromArgb(20,35,56):Color.FromArgb(10,69,121),dark?Color.FromArgb(7,17,31):Color.FromArgb(7,128,199),35f))g.FillRectangle(wallpaper,ClientRectangle);
        using(var glow=new SolidBrush(Color.FromArgb(13,255,255,255)))g.FillEllipse(glow,750,-200,1300,1200);
        using(var light=new Pen(Color.FromArgb(16,255,255,255),2)){
            g.DrawLine(light,0,760,1600,460);g.DrawLine(light,770,0,1100,952);
        }
        // A neutral example workspace. These are staged notes, not another installed app.
        g.FillRectangle(new SolidBrush(Color.FromArgb(35,0,0,0)),83,238,750,454);
        g.FillRectangle(Brushes.WhiteSmoke,73,228,750,454);g.FillRectangle(Brushes.White,74,229,748,40);
        TextAt(g,"Notes - demonstration workspace",91,240,14,Color.FromArgb(50,56,63));
        TextAt(g,"My workspace",108,303,27,Color.FromArgb(29,37,50),true);
        TextAt(g,"Keep working. Your quotas stay near the clock.",110,361,19,Color.FromArgb(83,95,111));
        TextAt(g,"1. Connect your account in Cypher.",110,420,18,Color.FromArgb(60,72,89));
        TextAt(g,"2. Minimize its window into the taskbar.",110,460,18,Color.FromArgb(60,72,89));
        TextAt(g,"3. Read the session and weekly limits at a glance.",110,500,18,Color.FromArgb(60,72,89));
        using(var line=new Pen(Color.FromArgb(223,228,234)))g.DrawLine(line,110,557,784,557);
        TextAt(g,"Demonstration accounts only. No personal files.",110,592,15,Color.FromArgb(111,121,135));
        if(showPanel){
            using(var shadow=new SolidBrush(Color.FromArgb(35,0,0,0)))g.FillRectangle(shadow,1096,180,430,704);
            g.InterpolationMode=InterpolationMode.HighQualityBicubic;g.DrawImage(panel,new Rectangle(1090,172,430,704));
        }
        // Staged Windows 10 shell context. Only the Cypher Surface is application UI.
        g.FillRectangle(new SolidBrush(Color.FromArgb(30,30,30)),0,952,1600,48);
        using(var pen=new Pen(Color.FromArgb(60,60,60)))g.DrawLine(pen,0,952,1600,952);
        for(int y=0;y<2;y++)for(int x=0;x<2;x++)g.FillRectangle(Brushes.WhiteSmoke,18+x*10,966+y*10,8,8);
        g.FillRectangle(new SolidBrush(Color.FromArgb(52,52,52)),55,953,278,46);
        TextAt(g,"Search",92,966,16,Color.FromArgb(210,210,210));
        using(var pen=new Pen(Color.FromArgb(210,210,210),1.5f)){g.DrawEllipse(pen,68,966,12,12);g.DrawLine(pen,78,978,84,984);}
        g.FillRectangle(new SolidBrush(Color.FromArgb(233,184,69)),354,967,23,17);g.FillRectangle(new SolidBrush(Color.FromArgb(255,207,89)),354,964,11,7);
        if(showPanel){g.DrawImage(icon,new Rectangle(408,961,31,31));g.FillRectangle(new SolidBrush(Color.FromArgb(130,187,231)),401,996,45,3);}
        g.DrawImageUnscaled(indicator,1268,956);
        // Neutral system icons and a deterministic clock/date, never the user's tray.
        using(var pen=new Pen(Color.WhiteSmoke,1.5f)){
            g.DrawLines(pen,new[]{new Point(1440,972),new Point(1445,967),new Point(1450,972)});
            g.DrawRectangle(pen,1464,967,13,10);g.DrawLine(pen,1467,980,1475,980);
        }
        TextAt(g,"12:00",1500,958,14,Color.WhiteSmoke);TextAt(g,"27/10/2026",1484,979,12,Color.WhiteSmoke);
    }
    protected override void Dispose(bool disposing){if(disposing)panel.Dispose();base.Dispose(disposing);}
}

static class SceneMain {
    [STAThread]static int Main(string[] args){
        Application.EnableVisualStyles();Application.SetCompatibleTextRenderingDefault(false);
        var data=Program.Json.Deserialize<System.Collections.Generic.Dictionary<string,object>>(System.IO.File.ReadAllText(args[0]));
        using(var surface=new Surface(IntPtr.Zero))using(var bar=new Bitmap(152,40))using(var icon=Image.FromFile(args[1])){
            surface.ClientSize=new Size(152,40);
            typeof(Surface).GetMethod("Render",BindingFlags.Instance|BindingFlags.NonPublic).Invoke(surface,new object[]{data});
            surface.DrawToBitmap(bar,new Rectangle(0,0,152,40));bar.Save(System.IO.Path.Combine(args[2],"showcase-native-strip.png"),ImageFormat.Png);
            foreach(var scene in new[]{"open","background","dark","fr"}){
                if(scene=="fr"){data["language"]="fr";typeof(Surface).GetMethod("Render",BindingFlags.Instance|BindingFlags.NonPublic).Invoke(surface,new object[]{data});surface.DrawToBitmap(bar,new Rectangle(0,0,152,40));}
                var file=System.IO.Path.Combine(args[2],scene=="fr"?"quotas-fr.png":scene=="dark"?"quotas-dark.png":"widget.png");
                using(var window=new WindowsScene(file,bar,icon,scene!="background",scene=="dark"))using(var image=new Bitmap(1600,1000)){
                    window.DrawToBitmap(image,new Rectangle(0,0,1600,1000));image.Save(System.IO.Path.Combine(args[2],"windows-scene-"+scene+".png"),ImageFormat.Png);
                }
            }
        }
        Console.WriteLine("Captured four native WinForms staged desktops and the real Surface indicator. No Explorer or user data used.");return 0;
    }
}
