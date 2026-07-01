(function() {
    'use strict';

    // ============================================================
    //  DATABASE
    // ============================================================
    const categoriesDB = [
        { id: 'all', name: 'همه', icon: 'fa-layer-group', image: 'assets/categories/all.png' },
        { id: 'شربت', name: 'شربت', icon: 'fa-wine-bottle', image: 'assets/categories/syrup.png' },
        { id: 'قطره', name: 'قطره', icon: 'fa-tint', image: 'assets/categories/drop.png' },
        { id: 'آمپول', name: 'آمپول', icon: 'fa-syringe', image: 'assets/categories/ampoule.png' },
        { id: 'قرص', name: 'قرص/کپسول', icon: 'fa-pills', image: 'assets/categories/pill.png' },
        { id: 'پودر', name: 'پودر', icon: 'fa-box-open', image: 'assets/categories/powder.png' }
    ];

    const drugsDB = [
        { id: 1, name: 'استامینوفن', form: 'شربت ۱۲۰mg/5ml', category: 'شربت', minMgPerKg: 10, maxMgPerKg: 15, intervalHours: 6, mgPerMl: 24, indications: ['تب', 'درد خفیف'], warning: 'خطر سمیت کبدی در مصرف بیش از حد مجاز.' },
        { id: 2, name: 'ایبوپروفن', form: 'شربت ۱۰۰mg/5ml', category: 'شربت', minMgPerKg: 5, maxMgPerKg: 10, intervalHours: 8, mgPerMl: 20, indications: ['تب', 'درد', 'التهاب'], warning: 'با معده پر مصرف شود. در کودکان زیر ۶ ماه توصیه نمی‌شود.' },
        { id: 3, name: 'آموکسی‌سیلین', form: 'سوسپانسیون ۲۵۰mg/5ml', category: 'شربت', minMgPerKg: 15, maxMgPerKg: 25, intervalHours: 8, mgPerMl: 50, indications: ['عفونت گوش میانی', 'عفونت باکتریایی'] },
        { id: 4, name: 'سفیکسیم', form: 'سوسپانسیون ۱۰۰mg/5ml', category: 'شربت', minMgPerKg: 4, maxMgPerKg: 8, intervalHours: 12, mgPerMl: 20, indications: ['عفونت ادراری', 'عفونت تنفسی'] },
        { id: 5, name: 'آزیترومایسین', form: 'سوسپانسیون ۲۰۰mg/5ml', category: 'شربت', minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 24, mgPerMl: 40, indications: ['عفونت‌های تنفسی غیرتیپیک'], warning: 'دوز ذکر شده برای روز اول است (روزهای بعد ۵mg/kg).' },
        { id: 20, name: 'لِوتیراستام (کپرا)', form: 'محلول ۱۰۰mg/ml', category: 'شربت', minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 12, mgPerMl: 100, indications: ['تشنج'], warning: 'دوز شروع. ممکن است طبق نظر پزشک افزایش یابد.' },
        { id: 6, name: 'استامینوفن', form: 'قطره ۱۰۰mg/ml', category: 'قطره', minMgPerKg: 10, maxMgPerKg: 15, intervalHours: 6, mgPerDrop: 5, indications: ['تب', 'درد'] },
        { id: 7, name: 'پروپرانولول', form: 'قطره ۱mg/ml', category: 'قطره', minMgPerKg: 0.5, maxMgPerKg: 1, intervalHours: 8, mgPerDrop: 0.05, indications: ['فشار خون', 'همانژیوم'] },
        { id: 9, name: 'سفتریاکسون', form: 'آمپول ۱g', category: 'آمپول', minMgPerKg: 25, maxMgPerKg: 50, intervalHours: 12, indications: ['عفونت شدید', 'مننژیت'], warning: 'در نوزادان مبتلا به هیپربیلیروبینمی منع مصرف دارد.' },
        { id: 10, name: 'جنتامایسین', form: 'آمپول ۸۰mg', category: 'آمپول', minMgPerKg: 2.5, maxMgPerKg: 3.5, intervalHours: 8, indications: ['عفونت باکتری‌های گرم منفی'], warning: 'نظارت بر عملکرد کلیه و شنوایی ضروری است.' },
        { id: 11, name: 'وانکومایسین', form: 'ویال ۵۰۰mg', category: 'پودر', minMgPerKg: 10, maxMgPerKg: 15, intervalHours: 6, indications: ['عفونت MRSA'] },
        { id: 14, name: 'متیل‌فنیدیت', form: 'قرص ۱۰mg', category: 'قرص', minMgPerKg: 0.3, maxMgPerKg: 0.6, intervalHours: 8, indications: ['ADHD'] },
        { id: 16, name: 'دیازپام', form: 'قرص ۵mg', category: 'قرص', minMgPerKg: 0.1, maxMgPerKg: 0.3, intervalHours: 8, indications: ['اسپاسم عضلانی', 'اضطراب'] },
        { id: 17, name: 'فنوباربیتال', form: 'قرص ۳۰mg', category: 'قرص', minMgPerKg: 1.5, maxMgPerKg: 3, intervalHours: 12, indications: ['تشنج'], warning: 'خطر خواب‌آلودگی شدید.' }
    ];

    // ============================================================
    //  VALIDATION ENGINE
    // ============================================================
    const ValidationEngine = {
        weightRanges: {
            'نوزاد': { min: 0.5, max: 2.5, label: 'نوزاد (۰-۱ ماه)' },
            'شیرخوار': { min: 2.6, max: 10, label: 'شیرخوار (۱ ماه تا ۲ سال)' },
            'کودک': { min: 10.1, max: 20, label: 'کودک (۲-۶ سال)' },
            'کودک بزرگتر': { min: 20.1, max: 30, label: 'کودک بزرگتر (۷-۱۰ سال)' },
            'نوجوان': { min: 30.1, max: 45, label: 'نوجوان (۱۱-۱۵ سال)' }
        },
        contraindications: {
            'ایبوپروفن': { minWeight: 6, warning: 'مصرف ایبوپروفن در شیرخواران زیر ۶ ماه (وزن کمتر از ۶ کیلوگرم) ممنوع است!', severity: 'high' },
            'استامینوفن': { minWeight: 2.5, warning: 'در نوزادان با وزن کمتر از ۲.۵ کیلوگرم، دوز باید توسط پزشک تعیین شود.', severity: 'medium' },
            'سفتریاکسون': { minWeight: 0, warning: 'در نوزادان مبتلا به زردی (هیپربیلیروبینمی) منع مصرف دارد!', severity: 'high' },
            'جنتامایسین': { minWeight: 0, warning: 'در نوزادان و شیرخواران نیاز به نظارت دقیق بر عملکرد کلیه و شنوایی دارد!', severity: 'high' },
            'وانکومایسین': { minWeight: 0, warning: 'مصرف در نوزادان نیاز به مانیتورینگ سطح سرمی دارد!', severity: 'high' },
            'لِوتیراستام (کپرا)': { minWeight: 5, warning: 'در شیرخواران زیر ۵ کیلوگرم با احتیاط فراوان مصرف شود!', severity: 'medium' }
        },
        getRecommendedForm: (drug, weight) => {
            if (weight < 10 && drug.category === 'شربت') {
                return { preferred: 'قطره', message: 'برای شیرخواران، فرم قطره یا سوسپانسیون مناسب‌تر است.', alternative: 'در صورت عدم دسترسی، شربت با دقت مصرف شود.' };
            }
            if (weight >= 10 && weight < 20 && drug.category === 'قطره') {
                return { preferred: 'شربت', message: 'برای کودکان بزرگتر، فرم شربت راحت‌تر است.', alternative: 'قطره نیز قابل استفاده است.' };
            }
            return null;
        },
        validateDose: (drug, weight) => {
            const minDose = drug.minMgPerKg * weight;
            const maxDose = drug.maxMgPerKg * weight;
            const warnings = [];
            const alerts = [];
            let severity = 'low';

            const dailyMax = maxDose * (24 / drug.intervalHours);
            if (dailyMax > 1000) {
                warnings.push(`دوز روزانه (${Math.round(dailyMax)}mg) بسیار بالاست!`);
                severity = 'high';
            }

            const contra = ValidationEngine.contraindications[drug.name];
            if (contra && weight < contra.minWeight) {
                alerts.push(contra.warning);
                severity = contra.severity;
            }

            const formRec = ValidationEngine.getRecommendedForm(drug, weight);
            if (formRec) {
                warnings.push(formRec.message);
                if (weight < 10) alerts.push(`توصیه: ${formRec.preferred} برای ${drug.name} مناسب‌تر است.`);
            }

            return { minDose, maxDose, dailyMax: Math.round(dailyMax), warnings, alerts, severity, isValid: alerts.length === 0 && severity !== 'high' };
        },
        validatePatient: (weight) => {
            const issues = [];
            if (weight < 0.5) issues.push({ type: 'error', message: 'وزن وارد شده بسیار کم است! لطفاً وزن را مجدداً بررسی کنید.', severity: 'critical' });
            if (weight < 2.5) issues.push({ type: 'warning', message: 'وزن نوزاد (کمتر از ۲.۵ کیلوگرم) نیاز به دقت بسیار بالا در محاسبه دوز دارد.', severity: 'high' });
            if (weight > 35) issues.push({ type: 'info', message: 'وزن بالای ۳۵ کیلوگرم - ممکن است بیمار نوجوان یا بزرگسال باشد.', severity: 'low' });

            let ageCategory = 'نوزاد';
            for (const [key, range] of Object.entries(ValidationEngine.weightRanges)) {
                if (weight >= range.min && weight <= range.max) {
                    ageCategory = key;
                    break;
                }
            }
            return { issues, ageCategory };
        }
    };

    // ============================================================
    //  DOM Caching
    // ============================================================
    const DOM = {
        categoryGrid: document.getElementById('categoryGrid'),
        searchInput: document.getElementById('searchInput'),
        clearSearch: document.getElementById('clearSearch'),
        drugList: document.getElementById('drugList'),
        resultCount: document.getElementById('resultCount'),
        drugCount: document.getElementById('drugCount'),
        fabBtn: document.getElementById('fabBtn'),
        helpBtn: document.getElementById('helpBtn'),
        helpModal: document.getElementById('helpModal'),
        modalClose: document.getElementById('modalClose'),
        favBtn: document.getElementById('favBtn'),
        navBtns: document.querySelectorAll('.nav-btn'),
        mainContent: document.getElementById('mainContent'),
        focusOverlay: document.getElementById('focusOverlay'),
        focusContent: document.getElementById('focusContent')
    };

    // ============================================================
    //  STATE
    // ============================================================
    const State = {
        category: 'all',
        searchQuery: '',
        selectedDrugId: null,
        isFocusMode: false
    };

    // ============================================================
    //  UTILITIES
    // ============================================================
    const Utils = {
        formatNum: (n) => parseFloat(n.toFixed(1)).toString(),
        getIntervalText: (hours) => {
            const map = { 24: 'هر ۲۴ ساعت', 12: 'هر ۱۲ ساعت', 8: 'هر ۸ ساعت', 6: 'هر ۶ ساعت', 4: 'هر ۴ ساعت' };
            return map[hours] || `هر ${hours} ساعت`;
        },
        generateHomeGuide: (drug, minDose, maxDose) => {
            if (drug.category === 'شربت' && drug.mgPerMl) {
                const minCc = Utils.formatNum(minDose / drug.mgPerMl);
                const maxCc = Utils.formatNum(maxDose / drug.mgPerMl);
                return `<strong>${Utils.toPersianNum(minCc)} تا ${Utils.toPersianNum(maxCc)} سی‌سی</strong> ${Utils.getIntervalText(drug.intervalHours)}`;
            } else if (drug.category === 'قطره' && drug.mgPerDrop) {
                const minDrops = Math.round(minDose / drug.mgPerDrop);
                const maxDrops = Math.round(maxDose / drug.mgPerDrop);
                return `<strong>${Utils.toPersianNum(minDrops)} تا ${Utils.toPersianNum(maxDrops)} قطره</strong> ${Utils.getIntervalText(drug.intervalHours)}`;
            }
            return `طبق تجویز دقیق پزشک مصرف شود.`;
        },
        vibrate: (ms = 10) => { if (navigator.vibrate) navigator.vibrate(ms); },
        toPersianNum: (str) => {
            const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            return str.toString().replace(/\d/g, (x) => persianDigits[x]);
        },
        getIconClass: (category) => {
            if(category === 'شربت') return 'fa-wine-bottle';
            if(category === 'قطره') return 'fa-tint';
            if(category === 'آمپول') return 'fa-syringe';
            if(category === 'پودر') return 'fa-box-open';
            return 'fa-pills';
        },
        debounce: (func, wait) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        // ===== چک کردن وجود تصویر =====
        checkImage: (url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
            });
        }
    };

    // ============================================================
    //  RENDERERS
    // ============================================================
    async function renderCategories() {
        const categoryPromises = categoriesDB.map(async (cat) => {
            const count = cat.id === 'all' ? drugsDB.length : drugsDB.filter(d => d.category === cat.id).length;
            const isActive = State.category === cat.id ? 'active' : '';
            
            let iconHtml;
            if (cat.image) {
                const imageExists = await Utils.checkImage(cat.image);
                if (imageExists) {
                    iconHtml = `<img src="${cat.image}" alt="${cat.name}" class="category-image" />`;
                } else {
                    iconHtml = `<i class="fas ${cat.icon}"></i>`;
                }
            } else {
                iconHtml = `<i class="fas ${cat.icon}"></i>`;
            }

            return `
                <div class="category-item ${isActive}" data-id="${cat.id}" role="tab" aria-selected="${isActive ? 'true' : 'false'}">
                    <div class="category-icon">${iconHtml}</div>
                    <div class="category-name">${cat.name}</div>
                    <div class="category-count">${Utils.toPersianNum(count)} دارو</div>
                </div>
            `;
        });
        
        const htmls = await Promise.all(categoryPromises);
        DOM.categoryGrid.innerHTML = htmls.join('');
    }

    function renderDrugs() {
        let filtered = drugsDB;
        if (State.category !== 'all') {
            filtered = filtered.filter(d => d.category === State.category);
        }
        if (State.searchQuery) {
            const q = State.searchQuery.toLowerCase();
            filtered = filtered.filter(d => 
                d.name.includes(q) || d.indications.some(i => i.includes(q)) || d.category.includes(q)
            );
        }

        DOM.drugCount.textContent = `${Utils.toPersianNum(drugsDB.length)} دارو`;
        DOM.resultCount.textContent = `${Utils.toPersianNum(filtered.length)} قلم`;

        if (filtered.length === 0) {
            DOM.drugList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search-minus"></i>
                    <h3>دارویی یافت نشد</h3>
                    <p>لطفاً دسته‌بندی یا عبارت جستجو را تغییر دهید.</p>
                </div>
            `;
            return;
        }

        DOM.drugList.innerHTML = filtered.map(drug => {
            const iconClass = Utils.getIconClass(drug.category);
            
            return `
                <article class="drug-list-card" data-drug-id="${drug.id}">
                    <div class="drug-card-content">
                        <div class="drug-icon-wrapper">
                            <i class="fas ${iconClass}"></i>
                        </div>
                        <div class="drug-details">
                            <h4 class="drug-name">${drug.name}</h4>
                            <span class="drug-form">${drug.form}</span>
                            <div class="drug-indications-mini">
                                ${drug.indications.slice(0, 2).map(i => `<span class="tag-mini">${i}</span>`).join('')}
                                ${drug.indications.length > 2 ? `<span class="tag-mini">+</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <button class="select-drug-btn" data-drug-id="${drug.id}">
                        <i class="fas fa-chevron-down"></i>
                        محاسبه دوز
                    </button>
                </article>
            `;
        }).join('');
    }

    // ============================================================
    //  FOCUS MODE
    // ============================================================
    function enterFocusMode(drugId) {
        const drug = drugsDB.find(d => d.id === parseInt(drugId));
        if (!drug) return;

        State.isFocusMode = true;
        State.selectedDrugId = drug.id;

        // محو کردن محتوای اصلی
        DOM.mainContent.classList.add('blurred');

        // ساخت محتوای فوکوس
        const iconClass = Utils.getIconClass(drug.category);
        
        DOM.focusContent.innerHTML = `
            <div class="focus-header">
                <div class="focus-title">
                    <i class="fas fa-calculator"></i>
                    محاسبه دوز <span class="drug-name-highlight">${drug.name}</span>
                </div>
                <button id="focusBackBtn" class="btn-back">
                    <i class="fas fa-arrow-right"></i>
                    بازگشت
                </button>
            </div>
            
            <div class="focus-drug-card">
                <div class="drug-icon-wrapper">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="drug-info">
                    <div class="drug-name">${drug.name}</div>
                    <div class="drug-form">${drug.form}</div>
                </div>
            </div>

            <div class="focus-calc-panel">
                <div class="mdh-base-dose" style="margin-bottom: 12px;">
                    <span>دوز پایه:</span>
                    <strong>${Utils.toPersianNum(drug.minMgPerKg)} تا ${Utils.toPersianNum(drug.maxMgPerKg)} میلی‌گرم بر کیلوگرم</strong>
                </div>
                
                <div class="weight-input-section">
                    <label class="weight-input-label">وزن بیمار را وارد کنید (کیلوگرم):</label>
                    <div class="weight-input-group">
                        <input type="number" id="focusWeightInput" step="0.1" min="0.5" max="150" placeholder="مثال: ۱۲.۵" autocomplete="off" />
                        <button id="focusCalcBtn" class="btn-primary">
                            <i class="fas fa-calculator"></i> محاسبه
                        </button>
                    </div>
                    <div id="focusWeightError" class="weight-error" hidden>لطفاً یک وزن معتبر وارد کنید.</div>
                </div>
                
                <div id="focusResultArea" class="focus-calc-result" hidden style="margin-top: 12px;"></div>
            </div>
        `;

        // نمایش اوورلی
        DOM.focusOverlay.hidden = false;

        // تمرکز روی اینپوت وزن
        setTimeout(() => {
            const input = document.getElementById('focusWeightInput');
            if (input) input.focus();
        }, 300);

        // رویدادهای دکمه بازگشت
        const backBtn = document.getElementById('focusBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', exitFocusMode);
        }

        // رویدادهای محاسبه
        const calcBtn = document.getElementById('focusCalcBtn');
        const weightInput = document.getElementById('focusWeightInput');
        const errorDiv = document.getElementById('focusWeightError');
        const resultArea = document.getElementById('focusResultArea');

        const performFocusCalculation = () => {
            const weightVal = parseFloat(weightInput.value);
            if (isNaN(weightVal) || weightVal <= 0) {
                errorDiv.hidden = false;
                resultArea.hidden = true;
                Utils.vibrate(50);
                return;
            }

            errorDiv.hidden = true;
            Utils.vibrate();

            const patientValidation = ValidationEngine.validatePatient(weightVal);
            const validation = ValidationEngine.validateDose(drug, weightVal);
            const minDose = validation.minDose;
            const maxDose = validation.maxDose;
            const showHomeGuide = ['شربت', 'قطره'].includes(drug.category);

            let patientWarningsHTML = '';
            if (patientValidation.issues.length > 0) {
                patientWarningsHTML = `
                    <div class="patient-validation">
                        ${patientValidation.issues.map(issue => `
                            <div class="validation-item ${issue.severity}">
                                <i class="fas ${issue.type === 'error' ? 'fa-times-circle' : issue.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                                <span>${issue.message}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            let warningClass = '';
            let validationHTML = '';
            
            if (validation.alerts.length > 0) {
                warningClass = 'has-contraindication';
                validationHTML = `
                    <div class="drug-contraindication ${validation.severity}">
                        ${validation.alerts.map(alert => `
                            <div class="contraindication-item">
                                <i class="fas fa-exclamation-circle"></i>
                                <span>${alert}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            if (validation.warnings.length > 0) {
                validationHTML += `
                    <div class="drug-validation-warnings">
                        ${validation.warnings.map(warning => `
                            <div class="validation-warning-item">
                                <i class="fas fa-info-circle"></i>
                                <span>${warning}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            let safetyBadge = '';
            if (validation.isValid) {
                safetyBadge = `<span class="safety-badge safe"><i class="fas fa-check-circle"></i> دوز ایمن</span>`;
            } else if (validation.severity === 'high') {
                safetyBadge = `<span class="safety-badge dangerous"><i class="fas fa-exclamation-triangle"></i> نیاز به احتیاط</span>`;
            } else {
                safetyBadge = `<span class="safety-badge caution"><i class="fas fa-shield-alt"></i> با احتیاط</span>`;
            }

            let formulaHTML = '';
            if (drug.minMgPerKg === drug.maxMgPerKg) {
                formulaHTML = `
                    <div class="formula-box">
                        <div class="formula-title"><i class="fas fa-square-root-variable"></i> فرمول محاسبه:</div>
                        <div class="formula-line">
                            <span class="f-desc">وزن (${Utils.toPersianNum(weightVal)} kg) × دوز پایه (${Utils.toPersianNum(drug.minMgPerKg)} mg/kg)</span>
                            <span class="f-result">= <strong>${Utils.toPersianNum(Utils.formatNum(minDose))} mg</strong></span>
                        </div>
                    </div>
                `;
            } else {
                formulaHTML = `
                    <div class="formula-box">
                        <div class="formula-title"><i class="fas fa-square-root-variable"></i> فرمول محاسبه:</div>
                        <div class="formula-line">
                            <span class="f-desc">حداقل: وزن (${Utils.toPersianNum(weightVal)} kg) × ${Utils.toPersianNum(drug.minMgPerKg)} mg/kg</span>
                            <span class="f-result">= <strong>${Utils.toPersianNum(Utils.formatNum(minDose))} mg</strong></span>
                        </div>
                        <div class="formula-line">
                            <span class="f-desc">حداکثر: وزن (${Utils.toPersianNum(weightVal)} kg) × ${Utils.toPersianNum(drug.maxMgPerKg)} mg/kg</span>
                            <span class="f-result">= <strong>${Utils.toPersianNum(Utils.formatNum(maxDose))} mg</strong></span>
                        </div>
                    </div>
                `;
            }

            const resultHTML = `
                ${patientWarningsHTML}
                ${validationHTML}
                ${drug.warning ? `
                    <div class="drug-warning">
                        <i class="fas fa-exclamation-triangle"></i> ${drug.warning}
                    </div>
                ` : ''}
                
                <div class="calc-final-result ${warningClass}">
                    <div class="cfr-header">
                        دوز محاسبه شده (در هر وعده):
                        ${safetyBadge}
                    </div>
                    <div class="cfr-amount">
                        ${drug.minMgPerKg === drug.maxMgPerKg 
                            ? `${Utils.toPersianNum(Utils.formatNum(minDose))} mg`
                            : `${Utils.toPersianNum(Utils.formatNum(minDose))} تا ${Utils.toPersianNum(Utils.formatNum(maxDose))} mg`
                        }
                    </div>
                    <div class="cfr-interval">
                        مصرف: <strong>${Utils.getIntervalText(drug.intervalHours)}</strong>
                    </div>
                </div>

                ${formulaHTML}

                ${showHomeGuide ? `
                    <div class="drug-home-guide">
                        <div class="home-guide-label">
                            <i class="fas fa-hand-holding-medical"></i> راهنمای مصرف در منزل
                        </div>
                        <div class="home-guide-text">${Utils.generateHomeGuide(drug, minDose, maxDose)}</div>
                        ${weightVal < 10 ? `
                            <div class="home-guide-note">
                                <i class="fas fa-baby"></i>
                                <span>توصیه: برای شیرخواران از قطره‌چکان یا سرنگ خوراکی استفاده کنید.</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            `;

            resultArea.innerHTML = resultHTML;
            resultArea.hidden = false;
            
            setTimeout(() => {
                resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        };

        if (calcBtn) {
            calcBtn.addEventListener('click', performFocusCalculation);
        }

        if (weightInput) {
            weightInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performFocusCalculation();
                }
            });
        }

        // کلیک روی backdrop برای بستن
        const backdropClickHandler = (e) => {
            if (e.target === DOM.focusOverlay) {
                exitFocusMode();
            }
        };
        DOM.focusOverlay.addEventListener('click', backdropClickHandler);

        // دکمه ESC برای بستن
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                exitFocusMode();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    function exitFocusMode() {
        State.isFocusMode = false;
        DOM.mainContent.classList.remove('blurred');
        DOM.focusOverlay.hidden = true;
        DOM.focusContent.innerHTML = '';
        
        // فوکوس روی دکمه محاسبه داروی قبلی
        const cards = document.querySelectorAll('.drug-list-card');
        cards.forEach(card => {
            if (parseInt(card.dataset.drugId) === State.selectedDrugId) {
                const btn = card.querySelector('.select-drug-btn');
                if (btn) setTimeout(() => btn.focus(), 100);
            }
        });
    }

    // ============================================================
    //  EVENTS
    // ============================================================
    function setupEvents() {
        const handleSearch = Utils.debounce((e) => {
            State.searchQuery = e.target.value.trim();
            DOM.clearSearch.hidden = !State.searchQuery;
            renderDrugs();
        }, 350);

        DOM.searchInput.addEventListener('input', handleSearch);

        DOM.clearSearch.addEventListener('click', () => {
            DOM.searchInput.value = '';
            State.searchQuery = '';
            DOM.clearSearch.hidden = true;
            renderDrugs();
            DOM.searchInput.focus();
        });

        DOM.categoryGrid.addEventListener('click', async (e) => {
            const item = e.target.closest('.category-item');
            if (!item) return;
            Utils.vibrate();
            State.category = item.dataset.id;
            await renderCategories();
            renderDrugs();
        });

        // رویداد کلیک روی دکمه‌های محاسبه دوز
        DOM.drugList.addEventListener('click', (e) => {
            const btn = e.target.closest('.select-drug-btn');
            if (!btn) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            Utils.vibrate();
            const drugId = btn.dataset.drugId;
            if (drugId) {
                enterFocusMode(drugId);
            }
        });

        DOM.helpBtn.addEventListener('click', () => {
            Utils.vibrate();
            DOM.helpModal.classList.add('active');
        });
        
        DOM.modalClose.addEventListener('click', () => DOM.helpModal.classList.remove('active'));
        
        DOM.helpModal.addEventListener('click', (e) => {
            if (e.target === DOM.helpModal) DOM.helpModal.classList.remove('active');
        });

        DOM.favBtn.addEventListener('click', function() {
            Utils.vibrate();
            const icon = this.querySelector('i');
            icon.classList.toggle('fas');
            icon.classList.toggle('far');
            icon.style.color = icon.classList.contains('fas') ? 'var(--warning-600)' : '';
        });

        DOM.fabBtn.addEventListener('click', () => {
            Utils.vibrate();
            DOM.searchInput.focus();
            window.scrollTo({ top: document.getElementById('searchSection').offsetTop, behavior: 'smooth' });
        });

        DOM.navBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                DOM.navBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                Utils.vibrate();
            });
        });
    }

    // ============================================================
    //  INIT
    // ============================================================
    async function init() {
        await renderCategories();
        renderDrugs();
        setupEvents();
        console.log('%c👶 Darooplus Pediatric - Focus Mode Enabled ✅', 'color: #0ea5e9; font-weight: bold; font-size: 14px;');
    }

    document.addEventListener('DOMContentLoaded', init);

})();
