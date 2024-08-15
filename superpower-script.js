let SegmentifySuperPowers = {
    config: {
        waitCount: 50
    },
    
    segmentifyAccountsInputFocus: function () {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const inputElement = document.querySelector('.page-options input');
                const ugElement = document.getElementById('__ug__client__styled__root__');

                if (inputElement && ugElement) {
                    setTimeout(() => {
                        inputElement.focus();
                        observer.disconnect();
                    }, 100);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        observer.observe(document.querySelector('#root'), {
            childList: true,
            subtree: true
        });
    },

    waitForDependencies: function () {
        let self = SegmentifySuperPowers;

        if (document.body) {
            self.segmentifyAccountsInputFocus();
        } else {
            self.config.waitCount++;
            if (self.config.waitCount < 75) {
                setTimeout(function () { self.waitForDependencies(); }, 75);
            }
        }
    },

    init: function () {
        SegmentifySuperPowers.waitForDependencies();
    }
};

// Initialize SegmentifySuperPowers
SegmentifySuperPowers.init();