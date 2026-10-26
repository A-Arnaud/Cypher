import {expect,it} from 'vitest';
import {taskbarBackend} from '../src/main/windows-platform';
it.each(['10.0.19045','10.0.20348'])('preserves legacy Windows backend for %s',release=>expect(taskbarBackend('win32',release)).toBe('embedded'));
it.each(['10.0.22000','10.0.22631','10.0.26100','11.0.1','12.0.0','','invalid','10.0','10.0.19045junk','6.1.7601'])('uses safe tray for newer or unknown Windows %s',release=>expect(taskbarBackend('win32',release)).toBe('tray'));
it.each(['linux','darwin'])('never injects a Windows helper on %s',platform=>expect(taskbarBackend(platform,'10.0.19045')).toBe('tray'));
