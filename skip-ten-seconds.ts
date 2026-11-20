// Loaded through skip-ten-seconds.json. Requires the playback permission.
function init() {
    $ui.register((ctx) => {
        const selector = 'button[aria-label="Play"], button[aria-label="Pause"], button[title="Play"], button[title="Pause"]';
        const mounting: Record<string, boolean> = {};
        ctx.dom.observe(selector, async (elements) => {
            for (const control of elements) {
                if (mounting[control.id]) continue;
                mounting[control.id] = true;
                try {
                    const parent = await control.getParent();
                    if (!parent || await parent.queryOne('[data-skip-ten]')) continue;
                    if (!ctx.videoCore.getCurrentClientId()) continue;
                    for (const seconds of [-10, 10]) {
                        const button = await ctx.dom.createElement('button');
                        button.setAttribute('type', 'button');
                        button.setAttribute('data-skip-ten', String(seconds));
                        button.setAttribute('aria-label', seconds < 0 ? 'Back 10 seconds' : 'Forward 10 seconds');
                        button.setAttribute('title', seconds < 0 ? 'Back 10 seconds' : 'Forward 10 seconds');
                        button.setText(seconds < 0 ? '\u21b6 10' : '10 \u21b7');
                        button.setCssText('display:inline-flex;align-items:center;justify-content:center;width:46px;height:36px;flex-shrink:0;border:0;border-radius:4px;background:rgba(25,25,25,.8);color:white;font-size:14px;cursor:pointer;margin:0 4px;');
                        button.addEventListener('click', () => ctx.videoCore.seek(seconds));
                        if (seconds < 0) control.before(button);
                        else control.after(button);
                    }
                } catch (error) {
                    console.error('Skip Ten Seconds:', error);
                } finally {
                    delete mounting[control.id];
                }
            }
        });
    });
}
