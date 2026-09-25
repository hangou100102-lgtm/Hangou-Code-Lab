/* 全文翻译：开启后，当界面语言为 English 时，站内各处的文字（正文、列表、说明）
   显示预置的英文版本。做法是用 [data-lang-variant="zh"|"en"] 两份内容，靠
   html[data-article-lang] 在 CSS 里切换显隐，不依赖任何在线翻译服务，数据不出设备。
   英文版本由 AI 辅助翻译，可能出现偏差，因此在被翻译内容前加一条免责提示。 */
(function () {
  'use strict';

  var KEY = 'hcl-article-translate';
  var NOTE = 'The English text on this page was produced with AI assistance. It may contain inaccuracies and is for reference only.';

  /* 设置页的状态说明 */
  var STATUS = {
    off: {
      zh: '未开启，站内文字保持中文原文。',
      en: 'Off. The site keeps its original Chinese text.'
    },
    zhUi: {
      zh: '已开启，但界面语言为中文，站内文字仍显示中文原文；把界面语言切到 English 即可看到英文版本。',
      en: 'On, but the interface is in Chinese, so the site still shows the original text. Switch the interface to English to read the English version.'
    },
    on: {
      zh: '已开启，站内各处的文字都显示英文版本；英文内容由 AI 辅助翻译，可能出现偏差，不保证 100% 正确。',
      en: 'On. The site shows AI-assisted English text, which may contain inaccuracies and is not guaranteed to be 100% correct.'
    }
  };

  var root = document.documentElement;
  var buttons = document.querySelectorAll('[data-translate-option]');
  var statusEl = document.querySelector('[data-translate-status]');
  var hasVariant = !!document.querySelector('[data-lang-variant="en"]');
  var noteEl = null;
  var on = getStored();

  function getStored() {
    try {
      return localStorage.getItem(KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function lang() {
    return window.HCLI18n && window.HCLI18n.get() === 'en' ? 'en' : 'zh';
  }

  function showNote() {
    if (noteEl) { return; }
    /* 紧贴英文内容上方：插到第一个英文变体之前，中文变体虽然在 DOM 里更靠前，
       但处于 display:none 状态，所以视觉上提示条正好位于英文内容上方。 */
    var target = document.querySelector('[data-lang-variant="en"]');
    if (!target || !target.parentNode) { return; }
    noteEl = document.createElement('p');
    noteEl.className = 'translate-note';
    noteEl.textContent = NOTE;
    target.parentNode.insertBefore(noteEl, target);
  }

  function hideNote() {
    if (!noteEl || !noteEl.parentNode) { return; }
    noteEl.parentNode.removeChild(noteEl);
    noteEl = null;
  }

  function apply() {
    var en = lang() === 'en';
    var translated = on && hasVariant && en;

    if (translated) {
      root.setAttribute('data-article-lang', 'en');
      showNote();
    } else {
      root.removeAttribute('data-article-lang');
      hideNote();
    }

    if (statusEl) {
      statusEl.textContent = STATUS[!on ? 'off' : (en ? 'on' : 'zhUi')][lang()];
    }

    for (var i = 0; i < buttons.length; i++) {
      var active = (buttons[i].getAttribute('data-translate-option') === 'on') === on;
      buttons[i].classList.toggle('is-active', active);
      buttons[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      on = this.getAttribute('data-translate-option') === 'on';
      try {
        localStorage.setItem(KEY, on ? '1' : '0');
      } catch (e) { /* 忽略隐私模式下的写入失败 */ }
      apply();
    });
  }

  /* 界面语言变化后，正文与状态说明都要跟着重新判定 */
  document.addEventListener('hcl:lang', apply);

  apply();
})();
