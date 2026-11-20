// Loaded through skip-ten-seconds.json. Requires the playback permission.
function init() {
    $ui.register((ctx) => {
        const selector = '[data-vc-element="control-bar-main-section"]';
        const mounting: Record<string, boolean> = {};
        ctx.dom.observe(selector, async (elements) => {
            for (const parent of elements) {
                const control = await parent.queryOne('[data-vc-element="timestamp"]');
                if (!control) continue;
                if (mounting[control.id]) continue;
                mounting[control.id] = true;
                try {
                    if (await parent.queryOne('[data-skip-ten]')) continue;
                    let anchor = control;
                    for (const seconds of [-10, 10]) {
                        const button = await ctx.dom.createElement('button');
                        button.setAttribute('type', 'button');
                        button.setAttribute('data-skip-ten', String(seconds));
                        button.setAttribute('aria-label', seconds < 0 ? 'Back 10 seconds' : 'Forward 10 seconds');
                        button.setAttribute('title', seconds < 0 ? 'Back 10 seconds' : 'Forward 10 seconds');
                        button.setInnerHTML('<span aria-hidden="true" style="font-size:30px;line-height:1;">' + (seconds < 0 ? '\u21b6' : '\u21b7') + '</span><span aria-hidden="true" style="font-size:14px;font-weight:600;line-height:1;">10</span>');
                        button.setAttribute('class', 'vc-control-button flex items-center justify-center transition-opacity relative h-full focus-visible:outline-none focus:outline-none focus-visible:opacity-50 px-2 hover:opacity-80');
                        button.setCssText('display:inline-flex;align-items:center;justify-content:center;gap:3px;min-width:54px;height:100%;min-height:36px;flex-shrink:0;border:0;border-radius:0;background:transparent;color:inherit;font-size:30px;font-weight:500;line-height:1;cursor:pointer;padding:0 8px;margin-left:' + (seconds < 0 ? '12px' : '0') + ';');
                        button.addEventListener('click', () => ctx.videoCore.seek(seconds));
                        anchor.after(button);
                        anchor = button;
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
