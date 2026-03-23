function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.remove('d-none');
    setTimeout(() => toast.classList.add('d-none'), 3000);
}

// Lingua
function selectLang(el, val) {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('is_english').value = val;
}

// Generi
function toggleGenre(el) {
    el.classList.toggle('selected');
}

function getSelectedGenres() {
    return Array.from(document.querySelectorAll('.genre-chip.selected'))
        .map(el => el.dataset.genre);
}

// Predizione
async function predict() {
    const btn = document.querySelector('.btn-predict');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    const budget = parseFloat(document.getElementById('budget').value);
    const runtime = parseFloat(document.getElementById('runtime').value);
    const release_month = parseInt(document.getElementById('release_month').value);
    const release_year = parseInt(document.getElementById('release_year').value);
    const is_english = parseInt(document.getElementById('is_english').value);
    const genres = getSelectedGenres();

    // Validazione
    if (!budget || !runtime || !release_year) {
        showToast('Compila tutti i campi obbligatori.');
        return;
    }

    // Loading
    btn.disabled = true;
    btnText.classList.add('d-none');
    btnSpinner.classList.remove('d-none');

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ budget, runtime, release_month, release_year, is_english, genres })
        });

        const data = await response.json();
        showResult(data.revenue, budget)

    } catch (error) {
        showToast('Errore durante la predizione. Riprova.');
    } finally {
        btn.disabled = false;
        btnText.classList.remove('d-none');
        btnSpinner.classList.add('d-none');
    }
}

// Mostra risultato
function showResult(revenue, budget) {
    document.getElementById('result-placeholder').classList.add('d-none');
    document.getElementById('result-content').classList.remove('d-none');

    // Formatta il revenue
    let formatted;
    if (revenue >= 1e9) {
        formatted = '$' + (revenue / 1e9).toFixed(2) + 'B';
    } else if (revenue >= 1e6) {
        formatted = '$' + (revenue / 1e6).toFixed(1) + 'M';
    } else {
        formatted = '$' + revenue.toLocaleString();
    }

    document.getElementById('result-value').textContent = formatted;

    // Categoria basata sul ROI
    const roi = (revenue - budget) / budget * 100;

    let category, color;
    if (roi < -50) {
        category = '💀 Flop';
        color = '#e74c3c';
    } else if (roi < 0) {
        category = '😐 Mediocre';
        color = '#f39c12';
    } else if (roi < 100) {
        category = '✅ Successo';
        color = '#2ecc71';
    } else if (roi < 300) {
        category = '🔥 Grande Successo';
        color = '#1abc9c';
    } else {
        category = '🚀 Blockbuster';
        color = '#f5c518';
    }

    const cat = document.getElementById('result-category');
    cat.textContent = category;
    cat.style.color = color;
}