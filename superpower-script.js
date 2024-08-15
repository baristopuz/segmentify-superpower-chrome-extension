let SegmentifySuperPowers = {
    config: {
        waitCount: 0,
        urls: [
            'https://v3.segmentify.com/admin/accounts',
            'https://v3.segmentify.com/admin/stats',
            'https://v3.segmentify.com/recommendations/view-all',
            'https://v3.segmentify.com/behavioural-targeting/engagement/view-all'
        ],
        ajaxWatchUrl: 'https://sauron.segmentify.com'
    },

    segmentifyAccountsInputFocus: function () {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const inputElement = document.querySelector('.page-options input');
                const searchInputElement = document.querySelector('.SearchProductForm_form___4oBi input');
                const ugElement = document.getElementById('__ug__client__styled__root__');

                if (inputElement && ugElement) {
                    setTimeout(() => {
                        inputElement.focus();
                        observer.disconnect();
                    }, 100);
                }

                if (searchInputElement && ugElement) {
                    setTimeout(() => {
                        searchInputElement.focus();
                        observer.disconnect();
                    }, 100);
                }
            });
        });

        const targets = [document.body, document.querySelector('#root'), document.querySelector('#wrapper')];
        targets.forEach(target => {
            if (target) {
                observer.observe(target, {
                    childList: true,
                    subtree: true
                });
            }
        });
    },

    waitForDependencies: function () {
        let self = SegmentifySuperPowers;

        if (!self.config.urls.includes(document.location.href)) return;

        this.interceptAjax();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                self.segmentifyAccountsInputFocus();
            });
        } else {
            self.config.waitCount++;
            if (self.config.waitCount < 75) {
                setTimeout(function () { self.waitForDependencies(); }, 75);
            } else {
                self.segmentifyAccountsInputFocus();
            }
        }
    },

    interceptAjax: function () {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
    
            if (typeof args[0] === 'string' && args[0].includes(this.config.ajaxWatchUrl)) {
                response.clone().json().then(() => {
                    this.segmentifyAccountsInputFocus();
                });
            }
            return response;
        };
    
        // Intercept XMLHttpRequest calls
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (...args) {
            this.addEventListener('load', () => {
                if (this.responseURL.includes(SegmentifySuperPowers.config.ajaxWatchUrl)) {
                    SegmentifySuperPowers.segmentifyAccountsInputFocus();
                }
            });
            originalXhrOpen.apply(this, args);
        };
    },    

    init: function () {
        this.waitForDependencies();
    }
};

// Initialize SegmentifySuperPowers
SegmentifySuperPowers.init();
