import {defineConfig} from 'vitest/config';
// Existing Windows fixtures contain Windows paths and .cmd launchers. Run the
// portable core plus native macOS subprocess coverage on both Mac architectures.
export default defineConfig({test:{environment:'node',include:[
 'tests/macos.test.ts','tests/mac-signing.test.ts','tests/codex-browser-login.test.ts','tests/accounts-direct.test.ts','tests/windows-platform.test.ts','tests/tray-host.test.ts',
 'tests/tray-menu.test.ts','tests/docking.test.ts','tests/widget.test.ts',
 'tests/poller.test.ts','tests/collection-queue.test.ts','tests/state-publisher.test.ts',
 'tests/credentials.test.ts','tests/api-providers.test.ts','tests/native-shell-guard.test.ts'
]}});
