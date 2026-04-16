export default function viteDevErrorForward() {
    let _server = null;
    return {
        name: 'vite-dev-error-forward',

        configureServer(server) {
            _server = server;

            // Watcher to respond on file changes (currently no-op)
            server.watcher.on('change', () => { /* no-op - no action on file change here */ });

            // Expose helper for sending errors to client's WebSocket
            server._sendDevError = (obj) => {
                try {
                    // WebSocket send expects string, so stringify the object before sending
                    server.ws.send(JSON.stringify({ type: 'custom', event: 'vite:dev-error', data: obj }));
                } catch (e) {
                    // Ignore any errors here to avoid crashing the dev server or plugin
                    // Typical example: client disconnected or WebSocket closed
                }
            };
        },

        buildEnd(err) {
            // Called by Vite after build finishes; if error exists, forward it
            if (_server && err) {
                try {
                    _server._sendDevError({
                        message: String(err),  // Convert error to string message
                        stack: err.stack || null  // Include stack if present
                    });
                } catch (e) {
                    // Ignore errors sending dev error to client - stable failsafe mechanism
                }
            }
        },

        async handleHotUpdate(ctx) {
            // Can be extended to capture hot update transform errors
            // Currently no operation to keep the plugin lightweight and stable
        }
    };
}
