document.addEventListener('DOMContentLoaded', function() {
    // 單位選擇按鈕事件 (保持不變)
    document.querySelectorAll('.unit-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.unit-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 運輸模式選擇按鈕事件 (保持不變)
    document.querySelectorAll('.transport-mode-selector .transport-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.transport-mode-selector .transport-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 取得起點和終點輸入框以及結果顯示區塊元素 (保持不變)
    const originPortInput = document.getElementById('originPort');
    const destinationPortInput = document.getElementById('destinationPort');
    const distanceResult = document.querySelector('.journey-results .distance');
    const emissionResult = document.querySelector('.journey-results .emission');
    const wttResult = document.querySelector('.journey-results .wtt');
    const ttwResult = document.querySelector('.journey-results .ttw');
    const fromToTextResult = document.querySelector('.journey-results .from-to-text'); // 取得新增的 from-to-text 元素

    // 定義模擬計算結果的函式 (Placeholder - 保持不變)
    function simulateCalculation(origin, destination) {
        const simulatedDistance = '10,985.199 km';
        const simulatedEmission = '0 tCO2e WTW';
        const simulatedWTT = 'WTT  0 tons';
        const simulatedTTW = 'TTW  0 tons';

        return {
            distance: simulatedDistance,
            emission: simulatedEmission,
            wtt: simulatedWTT,
            ttw: simulatedTTW
        };
    }

    // 定義更新結果顯示區塊的函式 (修改)
    function updateResults(results, origin, destination) { //  updateResults 函式現在接受 origin 和 destination 參數
        fromToTextResult.textContent = `From: ${origin}, To: ${destination}`; // 更新 from-to-text 元素的文字內容
        distanceResult.textContent = results.distance;
        emissionResult.textContent = results.emission;
        wttResult.textContent = results.wtt;
        ttwResult.textContent = results.ttw;
    }

    // 輸入框事件監聽器 (起點和終點共用 - 修改)
    function handleInputChange() {
        const originValue = originPortInput.value.trim();
        const destinationValue = destinationPortInput.value.trim();

        if (originValue !== '' && destinationValue !== '') {
            const calculationResults = simulateCalculation(originValue, destinationValue);
            updateResults(calculationResults, originValue, destinationValue); //  handleInputChange 函式現在傳遞 originValue 和 destinationValue 給 updateResults
        } else {
            resetResultsDisplay();
        }
    }

    // 重置結果顯示區塊為預設值的函式 (可選 - 保持不變)
    function resetResultsDisplay() {
        fromToTextResult.textContent = ''; // 重置 from-to-text 元素的文字內容為空
        distanceResult.textContent = '0 km';
        emissionResult.textContent = '0 tCO2e WTW';
        wttResult.textContent = 'WTT  0 tons';
        ttwResult.textContent = 'TTW  0 tons';
    }

    // 為起點和終點輸入框添加 'input' 事件監聽器 (保持不變)
    originPortInput.addEventListener('input', handleInputChange);
    destinationPortInput.addEventListener('input', handleInputChange);

    // 初始載入時，如果輸入框已有預設值，則執行一次計算並更新結果 (可選 - 修改)
    if (originPortInput.value.trim() !== '' && destinationPortInput.value.trim() !== '') {
        handleInputChange(); // 觸發一次輸入框事件處理函式，進行初始計算和結果顯示
    } else {
        resetResultsDisplay();
    }


    // 取得起點和終點輸入框以及結果顯示區塊元素 (保持不變)
    const originPortInput = document.getElementById('originPort');
    const destinationPortInput = document.getElementById('destinationPort');
    const distanceResult = document.querySelector('.journey-results .distance');
    const wttResult = document.querySelector('.journey-results .wtt');
    const ttwResult = document.querySelector('.journey-results .ttw');
    const fromToTextResult = document.querySelector('.journey-results .from-to-text');

    // 取得電力消耗區塊的輸入元素
    const regionInput = document.getElementById('region');
    const yearInput = document.getElementById('year');
    const energyInput = document.getElementById('energy');
    const energyUnitSelect = document.getElementById('energyUnit');

    // 取得 API 回應顯示區塊 (將 emissionResult 重命名為 apiResponseResult 以更清晰地表達其用途)
    const apiResponseResult = document.querySelector('.journey-results .emission');
    const journeyResultsBlock = document.querySelector('.journey-results'); // 取得整個 journey-results 區塊

    // 定義呼叫 Climatiq API 的函式
    async function callClimatiqAPI(region, year, energy, energyUnit) {
        const apiKey = '$CLIMATIQ_API_KEY'; // **!!! 重要提示：請將 $CLIMATIQ_API_KEY 替換成您自己的 API 金鑰 !!!**
        const apiUrl = 'https://api.climatiq.io/data/v1/estimate';

        const requestBody = {
            "emission_factor": {
                "activity_id": "electricity-supply_grid-source_total_supplier_mix",
                "region": region,
                "year": parseInt(year), // 確保 year 是數字類型
                "data_version": "^6"
            },
            "parameters": {
                "energy": parseFloat(energy), // 確保 energy 是數字類型
                "energy_unit": energyUnit
            }
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                // 顯示錯誤訊息在結果區塊，並拋出錯誤
                const errorJson = await response.json(); // 嘗試解析錯誤回應為 JSON
                updateAPIResponseDisplay(`API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorJson, null, 2)}`);
                throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }

            const responseData = await response.json();
            return responseData;

        } catch (error) {
            console.error('API call error:', error);
            // 錯誤訊息已經在 updateAPIResponseDisplay 中顯示，這裡不需要再次處理，直接 return null
            return null;
        }
    }


    // 定義更新 API 回應顯示區塊的函式 (顯示 JSON Highlight)
    function updateAPIResponseDisplay(apiResponse) {
        // 使用 <pre> 和 <code> 標籤來呈現 JSON，並加入簡單的 Highlight 樣式
        const formattedJson = (typeof apiResponse === 'object') ? JSON.stringify(apiResponse, null, 2) : apiResponse; // 如果是物件，才進行格式化，否則直接顯示字串 (錯誤訊息)
        apiResponseResult.innerHTML = `<pre><code class="json-highlight">${escapeHtml(formattedJson)}</code></pre>`;
        journeyResultsBlock.style.display = 'block'; // 確保結果區塊顯示
        highlightJSON(); // 呼叫 JSON highlight 函式
    }


    // 定義簡單的 JSON Highlight 函式 (簡易版，僅處理基本語法高亮)
    function highlightJSON() {
        document.querySelectorAll('code.json-highlight').forEach((block) => {
            hljs.highlightBlock(block); // 使用 highlight.js 進行語法高亮
        });
    }

    // HTML escape 函式，避免 XSS 攻擊
    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
     }


    // 輸入框事件處理函式 (電力消耗區塊 - 修改為呼叫 API)
    async function handleElectricityInputChange() {
        const regionValue = regionInput.value.trim().toUpperCase(); // 取得地區值並轉為大寫
        const yearValue = yearInput.value.trim();
        const energyValue = energyInput.value.trim();
        const energyUnitValue = energyUnitSelect.value;


        // 簡單驗證輸入值 (您可以根據 API 的具體要求增加更嚴格的驗證)
        if (regionValue && yearValue && energyValue && energyUnitValue) {
            // 輸入值都存在，呼叫 API 並更新結果
            const apiData = await callClimatiqAPI(regionValue, yearValue, energyValue, energyUnitValue);
            if (apiData) { // 只有當 API 呼叫成功且有返回資料時，才更新顯示
               updateAPIResponseDisplay(apiData);
            }
        } else {
            // 如果有任何輸入框為空，可以選擇清空結果顯示區塊，或者顯示預設訊息
            updateAPIResponseDisplay("請輸入完整的電力消耗資訊 (Region, Year, Energy, Energy Unit)。"); // 顯示提示訊息
            journeyResultsBlock.style.display = 'block'; // 確保結果區塊顯示 (即使是提示訊息)
        }
    }


    // 為電力消耗區塊的輸入框添加 'input' 事件監聽器
    regionInput.addEventListener('input', handleElectricityInputChange);
    yearInput.addEventListener('input', handleElectricityInputChange);
    energyInput.addEventListener('input', handleElectricityInputChange);
    energyUnitSelect.addEventListener('input', handleElectricityInputChange);


    // --- 以下是原本 Journey Section 的程式碼 (保持不變，或者您可以選擇移除，如果這個範例程式碼主要關注電力消耗計算) ---
    // (原本的單位選擇按鈕、運輸模式選擇按鈕事件監聽器，handleInputChange 函式，resetResultsDisplay 函式，以及 Journey Section 輸入框的事件監聽器， 這些程式碼如果您在這個範例中主要關注電力消耗計算，可以選擇移除，只保留電力消耗區塊的程式碼)
    // --- Journey Section 程式碼可以選擇性移除或保留 ---



    // 初始化時清空 API 結果顯示區塊 (可選，如果希望頁面載入時結果區塊是空的)
    updateAPIResponseDisplay(""); // 清空 API 結果顯示區塊
    journeyResultsBlock.style.display = 'block'; // 初始時也確保結果區塊顯示 (即使內容為空)

});