'use strict';

// Case state lives in memory. Each composer owns its draft and suggestion state.
const replyVariants = {
  balanced: {
    full: ["You're all set, TestBot! I've arranged for your replacement base, and you should receive a confirmation email shortly with the return instructions and a prepaid FedEx return label. You can use the label to arrange a pickup, or let us know if you'd like us to schedule one for you. Is there anything else I can help with today?", "Your replacement base is arranged, TestBot! A confirmation email will arrive shortly with return instructions and a prepaid FedEx return label. You can arrange a pickup with the label, or we can help schedule one. What else can I help you with today?"],
    short: ["All set, TestBot! Your replacement base is arranged. You'll receive a confirmation email shortly with return instructions and a prepaid FedEx label. We can also help schedule a pickup if needed. Anything else I can help with?", "TestBot, your replacement base is arranged. Watch for a confirmation email with return instructions and a prepaid FedEx label. Let us know if you need pickup assistance. Anything else today?"]
  },
  empathetic: {
    full: ["Thank you so much for your patience, TestBot! I know dealing with this issue has been frustrating, and I really appreciate you working through those steps with me. Your replacement base is arranged, and you'll receive an email shortly with the confirmation, return instructions, and prepaid FedEx label. If you'd like help scheduling a pickup, we're happy to assist. Is there anything else I can help you with?", "I understand how frustrating this has been, TestBot. Thank you for your patience and for trying those steps with me. I've arranged your replacement base. Your confirmation email will include return instructions and a prepaid FedEx label, and we can help schedule a pickup. Is there anything else you need today?"],
    short: ["Thanks for your patience, TestBot. I know this has been frustrating. Your replacement base is arranged; a confirmation email will include return instructions and a prepaid FedEx label. We're happy to help schedule a pickup.", "I appreciate your patience with this frustrating issue, TestBot. Your replacement base is arranged. Look for a confirmation email with return instructions and a prepaid FedEx label. We can assist with pickup scheduling."]
  },
  enthusiastic: {
    full: ["You're all set, TestBot! Your replacement base is arranged, and you'll receive a confirmation email shortly with the return instructions and prepaid FedEx label. Hopefully, this gets your wedding gift running smoothly for you and Casper. Congratulations again on your wedding! If you'd prefer, we can also help schedule a FedEx pickup. Is there anything else I can help with today?", "Congratulations again on your wedding, TestBot! Let's get your gift working as it should for you and Casper. I've arranged your replacement base. You'll receive a confirmation email with return instructions and a prepaid FedEx label shortly. We can help schedule a pickup too. Is there anything else I can do for you today?"],
    short: ["All set, TestBot! Your replacement base is arranged—here's to smoother days for you and Casper with your wedding gift. Your confirmation email will include return instructions and a prepaid FedEx label. We can help schedule a pickup too!", "Your replacement base is arranged, TestBot! Congratulations again on your wedding, and here's to smoother days for Casper. Look for a confirmation email with return instructions and a prepaid FedEx label. Need pickup help? We're happy to assist."]
  },
  professional: {
    full: ["Thank you for your patience, TestBot. I've completed the replacement base arrangement, and you'll receive a confirmation email shortly containing the return instructions and prepaid FedEx label. You can arrange a pickup using the provided label or contact us for scheduling assistance. Is there anything else I can assist you with today?", "Your replacement base has been arranged, TestBot. Next, you'll receive a confirmation email with return instructions and a prepaid FedEx label. Use the label to arrange a pickup, or let us help with scheduling. Thank you for working through the troubleshooting steps. How else can I assist you?"],
    short: ["TestBot, your replacement base is arranged. A confirmation email will follow with return instructions and a prepaid FedEx label. You can arrange a pickup or contact us for scheduling assistance.", "Your replacement base is arranged, TestBot. Please check your confirmation email for return instructions and a prepaid FedEx label. We can assist with scheduling a pickup if needed."]
  }
};
// Email templates share verified demo questions; tone-specific prose stays separate.
const emailQuestions = "Could you please let us know:\n\n- Is your Litter-Robot located near your Wi-Fi router, or is it a bit farther away?\n- Are you using any Wi-Fi extenders or a mesh network?\n- Is your Litter-Robot connected to a 2.4 GHz or 5 GHz Wi-Fi network?";
const emailStep = "If your router supports it, I'd also recommend creating a separate 2.4 GHz guest network and connecting your Litter-Robot to that network to see if it helps maintain a more stable connection.";
const emailToneCopy = {
  balanced: [
    ["Thank you for contacting Whisker Customer Experience! I'm sorry to hear that your Litter-Robot 5 has been having trouble staying connected to Wi-Fi. I understand how frustrating that can be, especially after you've already tried restarting and reconnecting the unit.\n\nI'd be happy to help you look into a few additional things!", "If the issue continues after trying this, please reach back out and let us know. We'll be happy to look into the next steps with you!"],
    ["Thank you for reaching out to Whisker Customer Experience about your Litter-Robot 5. Since restarting and reconnecting through the app haven't resolved the disconnections, let's take a closer look at your network setup.", "Please reply with those details and let us know whether the optional network change helps. If disconnections continue, our team will help you explore the next steps."]
  ],
  empathetic: [
    ["Thank you for contacting Whisker Customer Experience. I'm sorry the repeated Wi-Fi disconnections have been so frustrating. You've already spent time restarting your Litter-Robot 5 and reconnecting through the app, and I appreciate your patience. Let's look at some additional network details together.", "If the issue continues, please reply and tell us what you noticed. We understand this has taken time, and we'll continue helping you with the next steps."],
    ["Thank you for getting in touch with Whisker Customer Experience. Having your Litter-Robot 5 keep going offline after you've already tried to fix it is understandably frustrating. Rather than ask you to repeat the restart and app reconnection, we'd like to understand the connection itself.", "Please send us your answers and any results from the optional network step. If it still disconnects, we're here to work through what comes next with you."]
  ],
  personalized: [
    ["Thanks for contacting Whisker Customer Experience, [Customer Name]! I'd be happy to help with your Litter-Robot 5's Wi-Fi connection. Thanks for letting us know you've already restarted and reconnected through the app. Let's check a few network details next.", "Let us know how it goes, [Customer Name]. If the connection still drops, just reply here and our team will be happy to keep helping!"],
    ["It's good to hear from you, [Customer Name], and thank you for contacting Whisker Customer Experience. I see you've already tried restarting your Litter-Robot 5 and reconnecting it in the app. We can build on those steps by looking at how it connects to your home network.", "Send us your answers when you have a chance, and let us know if the optional step makes a difference. We're here to help with the next steps if it keeps going offline."]
  ],
  professional: [
    ["Thank you for contacting Whisker Customer Experience. We understand your Litter-Robot 5 continues to disconnect after a restart and app reconnection. To identify appropriate next steps, please provide the network details below.", "Please reply with your network details and the outcome of any optional change. If the issue persists, our team will review the information and assist with the next steps."],
    ["Thank you for reaching Whisker Customer Experience. You've confirmed that restarting the Litter-Robot 5 and reconnecting through the app did not resolve the intermittent connection. The next step is to review the network configuration.", "If disconnections continue, reply with the requested information and any changes you tried. We will use those details to help determine the next steps."]
  ]
};
const emailShortCopy = {
  balanced: ["Thank you for contacting Whisker Customer Experience. I'm sorry your Litter-Robot 5 still disconnects after restarting and app reconnection.", "Thanks for reaching Whisker Customer Experience. Let's check your network setup since restarting and reconnecting haven't helped."],
  empathetic: ["Thank you for contacting Whisker Customer Experience. I understand how frustrating the repeated disconnections are after your restart and app reconnection. Thank you for your patience.", "Thanks for reaching Whisker Customer Experience. I'm sorry this keeps happening despite your efforts to restart and reconnect. We appreciate your patience as we look further."],
  personalized: ["Thanks for contacting Whisker Customer Experience, [Customer Name]! Let's build on the restart and app reconnection you've already tried.", "Thank you for reaching Whisker Customer Experience, [Customer Name]. We're happy to help check your network after the restart and app reconnection didn't resolve this."],
  professional: ["Thank you for contacting Whisker Customer Experience. Since restarting and app reconnection did not resolve the issue, please confirm the following.", "Thank you for reaching Whisker Customer Experience. To assess the disconnections following your restart and app reconnection, please provide these network details."]
};
function emailTemplate(intro, followup, shortened = false) {
  const questions = shortened ? "- How close is the unit to your Wi-Fi router?\n- Do you use Wi-Fi extenders or a mesh network?\n- Is it connected to 2.4 GHz or 5 GHz Wi-Fi?" : emailQuestions;
  const step = shortened ? "If your router supports it, you can try a separate 2.4 GHz guest network to see whether it improves stability." : emailStep;
  return "Hello [Customer Name],\n\n" + intro + "\n\n" + questions + "\n\n" + step + "\n\n" + followup + "\n\nBest regards,\nWhisker Customer Experience";
}
const emailVariants = Object.fromEntries(Object.entries(emailToneCopy).map(([tone, variations]) => [tone, {
  full: variations.map(([intro, followup]) => emailTemplate(intro, followup)),
  short: emailShortCopy[tone].map((intro, index) => emailTemplate(intro, index === 0 ? "If the issue continues, please reply with these details. Our team will be happy to help with the next steps." : "Please send your answers and let us know if disconnections persist. We're available to continue helping.", true))
}]));
const smartReplySuggestions = {chat: replyVariants, email: emailVariants};
const smartReplyStates = {
  chat: {tone: 'balanced', variant: 0, shortened: false},
  email: {tone: 'balanced', variant: 0, shortened: false}
};
function currentSuggestion() {
  const state = smartReplyStates[activeCase];
  return smartReplySuggestions[activeCase][state.tone][state.shortened ? 'short' : 'full'][state.variant].replaceAll('[Customer Name]', cases[activeCase].name);
}
const demoDetails = {name: 'TestBot 1', email: 'testbot1@example.com', serial: 'LR5-123-456-7890', rma: 'RMA-2026-10482', replacement: 'WR-2026-58321', caseId: '10001', product: 'Litter-Robot 5'};
const noteSummary = "Customer reported a persistent Drawer Full error on their Litter-Robot 5 despite emptying the waste drawer. Customer verified proper waste bag placement, removed and reinserted the drawer, and attempted waste drawer recalibration, which failed. Customer also cleaned the sensors, checked for debris, and performed a hard reset, but the error persisted. Troubleshooting was unsuccessful, so a replacement base was arranged, with confirmation, return instructions, and a prepaid FedEx label to follow.";
const internalNotes = {draft: '', html: '', suggestionAvailable: false};
let chatTab = 'reply';
function isNotes() { return activeCase === 'chat' && chatTab === 'notes'; }
function editorState() { return isNotes() ? internalNotes : cases[activeCase]; }
const chatHistory = [
  ['customer', "Hi! I recently received my Litter-Robot 5 as a wedding gift, and I've been having trouble with it already. It keeps saying the waste drawer is full, even though I just emptied it. I can't seem to get the notification to clear.", '10:31 AM'],
  ['agent', "First off, congratulations on your wedding! I'm sorry you're running into this issue with your new Litter-Robot, especially so soon after receiving it. Let's see what we can do to get this sorted out for you.", '10:32 AM'],
  ['agent', "Before we get started, could you please provide the serial number for your Litter-Robot 5? That'll help me pull up the correct unit details.", '10:32 AM'],
  ['customer', "Of course! It's " + demoDetails.serial + ".", '10:32 AM'],
  ['agent', "Could you try removing the waste drawer, making sure the bag is sitting flat and isn't sticking up around the edges, then reinserting it?", '10:32 AM'],
  ['customer', "I've tried that a few times already, but it's still showing full. My cat Casper keeps trying to use it, so I'm hoping we can get this sorted out soon!", '10:33 AM'],
  ['agent', "Thanks for checking! Let's try recalibrating the waste drawer to see if that clears the error. Could you follow the recalibration steps and let me know whether it completes successfully?", '10:34 AM'],
  ['customer', "I just tried recalibrating it, but unfortunately, the calibration didn't pass.", '10:35 AM'],
  ['agent', "Thanks for giving that a try. Let's also make sure the sensors and drawer area are clean and free of any debris. Once that's done, please perform a hard reset and check whether the error clears.", '10:34 AM'],
  ['customer', "I cleaned the sensors and checked for debris, then performed the hard reset. It's still showing the Drawer Full error.", '10:36 AM'],
  ['agent', "Thanks for trying those steps with me. Since the issue is still happening after troubleshooting, we'll move forward with a replacement base. I'm going to place you on a brief hold while I get that arranged.", '10:37 AM'],
  ['customer', 'No worries, take your time!', '10:38 AM']
];
const cases = {
  chat: { name: 'TestBot 1', number: '#10001', channel: 'Live Chat', status: 'Active', issue: 'Persistent Drawer Full error', draft: '', suggestionAvailable: true, messages: chatHistory.map(([role, text, time]) => ({role, text, time})) },
  email: { name: 'TestBot 2', number: '#10002', channel: 'Email', status: 'Open', issue: 'Connectivity support', draft: '', suggestionAvailable: true, subject: 'Litter-Robot 5 keeps disconnecting from Wi-Fi', messages: [{role: 'customer', time: '9:42 AM', text: "Hi Support,\n\nMy Litter-Robot 5 has been disconnecting from Wi-Fi randomly over the past few days. I've restarted the unit and tried reconnecting it through the app, but it keeps going offline after a while.\n\nIs there anything else I can try?\n\nThanks,\nTestBot 2"}] }
};
let activeCase = 'chat';
const byId = id => document.getElementById(id);
const input = byId('reply-input');
const ghost = byId('ghost-text');
const thread = byId('thread');
const conversation = byId('conversation');
let activationTimer;

function confirmSmartReply() {
  const label = menuTrigger;
  clearTimeout(activationTimer);
  label.classList.remove('is-activated');
  void label.offsetWidth;
  label.classList.add('is-activated');
  // Cleanup also runs when reduced motion disables the CSS animation.
  activationTimer = setTimeout(() => label.classList.remove('is-activated'), 700);
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function avatar(role) {
  const node = element('span', `avatar ${role === 'agent' ? 'agent-avatar' : ''}`, role === 'agent' ? 'UB' : 'TB');
  node.setAttribute('aria-hidden', 'true');
  return node;
}

function renderMessage(message, supportCase) {
  if (message.role === 'note') return renderInternalNote(message);
  const isAgent = message.role === 'agent';
  const name = isAgent ? 'You' : supportCase.name;
  const time = element('time', '', message.time);
  if (message.sentAt) time.dateTime = message.sentAt;
  if (activeCase === 'email') {
    const card = element('article', 'email-card');
    const header = element('div', 'email-card-header');
    const sender = element('div', 'email-sender', name);
    sender.append(element('small', '', isAgent ? `To: ${supportCase.name}` : 'To: Support'));
    header.append(avatar(message.role), sender, time);
    card.append(header, element('div', 'email-body', message.text));
    return card;
  }
  const row = element('article', `message ${message.role}`);
  const content = element('div', 'message-content');
  const meta = element('div', 'message-meta');
  meta.append(element('span', '', name), time);
  content.append(meta, element('div', 'message-bubble', message.text));
  row.append(avatar(message.role), content);
  return row;
}

function scrollToLatest() { conversation.scrollTop = conversation.scrollHeight; }

function resizeEditor() {
  if (isNotes()) return;
  input.style.height = 'auto';
  // Both text layers share one scrolling editor inside the user-sized form.
  byId('editor').style.maxHeight = 'none';
  input.style.maxHeight = 'none';
  input.style.height = `${Math.max(input.scrollHeight, ghost.hidden ? 0 : ghost.scrollHeight)}px`;
}

function syncComposer() {
  if (isNotes()) {
    ghost.hidden = true;
    ghost.textContent = '';
    byId('accept-hint').hidden = true;
    byId('editing-hint').hidden = true;
    byId('send-button').disabled = !byId('notes-document').textContent.trim();
    input.removeAttribute('aria-description');
    updateMenu();
    return;
  }
  const state = editorState();
  const showSuggestion = state.suggestionAvailable && input.value.length === 0;
  ghost.hidden = !showSuggestion;
  ghost.textContent = showSuggestion ? currentSuggestion() : '';
  byId('accept-hint').hidden = !showSuggestion;
  byId('editing-hint').hidden = showSuggestion || !input.value;
  byId('send-button').disabled = !input.value.trim();
  input.setAttribute('aria-description', showSuggestion ? `${isNotes() ? 'SmartNotes' : 'SmartReply'} suggestion: ${currentSuggestion()} Press Tab to accept.` : '');
  resizeEditor();
  updateMenu();
}

function selectCase(key) {
  finishComposerResize();
  closeMenu();
  clearTimeout(activationTimer);
  byId('smartreply-label').classList.remove('is-activated');
  storeActiveDraft();
  activeCase = key;
  const state = cases[key];
  document.querySelectorAll('[data-case]').forEach(button => {
    const selected = button.dataset.case === key;
    button.classList.toggle('selected', selected);
    if (selected) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
  byId('customer-name').textContent = state.name;
  byId('case-number').textContent = state.number;
  byId('case-channel').textContent = state.channel;
  byId('case-status').textContent = state.status;
  byId('case-status').classList.toggle('open', key === 'email');
  byId('issue-title').textContent = state.issue;
  byId('reply-label').textContent = `Reply to ${state.name}`;
  byId('smartreply-label').hidden = false;
  byId('reply-form').classList.toggle('email-composer', key === 'email');
  byId('email-reply-context').hidden = key !== 'email';
  byId('email-reply-context').textContent = key === 'email' ? 'To: ' + state.name + ' | Re: ' + state.subject : '';
  byId('composer-help').textContent = key === 'email' ? 'Enter for a new line. Use Send reply to send.' : 'Enter to send ? Shift + Enter for a new line';
  byId('chat-context').hidden = key !== 'chat';
  byId('email-context').hidden = key !== 'email';
  byId('context-heading').textContent = key === 'email' ? 'Conversation context' : 'Personalization detected';
  const personalTone = menuActions.find(button => ['enthusiastic', 'personalized'].includes(button.dataset.tone));
  personalTone.dataset.tone = key === 'email' ? 'personalized' : 'enthusiastic';
  personalTone.querySelector('strong').textContent = key === 'email' ? 'Friendly & Personalized' : 'Enthusiastic & Personalized';
  byId('editor').scrollTop = 0;
  input.scrollTop = 0;
  thread.classList.toggle('email-thread', key === 'email');
  thread.replaceChildren(element('div', 'date-divider', 'Demo conversation'));
  if (key === 'email') thread.append(element('h3', 'email-subject', state.subject));
  state.messages.forEach(message => thread.append(renderMessage(message, state)));
  input.value = editorState().draft;
  configureComposerMode();
  input.placeholder = '';
  applyComposerHeight();
  syncComposer();
  if (key === 'email') conversation.scrollTop = 0;
  else scrollToLatest();
}

function sendReply() {
  if (isNotes()) { saveInternalNote(); return; }
  const text = input.value.trim();
  if (!text) return;
  const state = cases[activeCase];
  const now = new Date();
  const message = { role: 'agent', text, time: now.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'}), sentAt: now.toISOString() };
  state.messages.push(message);
  state.draft = '';
  state.suggestionAvailable = false;
  thread.append(renderMessage(message, state));
  input.value = '';
  syncComposer();
  scrollToLatest();
  byId('announcement').textContent = `Demo reply added to ${state.name}'s ${state.channel} conversation.`;
  input.focus();
}

const menu = byId('smartreply-menu');
let menuTrigger = byId('smartreply-label');
const menuActions = [...menu.querySelectorAll('[data-tone]')];

function positionMenu() {
  if (menu.hidden) return;
  const viewport = window.visualViewport;
  const left = viewport ? viewport.offsetLeft : 0;
  const top = viewport ? viewport.offsetTop : 0;
  const width = viewport ? viewport.width : window.innerWidth;
  const height = viewport ? viewport.height : window.innerHeight;
  menu.style.maxHeight = `${Math.max(80, height - 24)}px`;
  menu.style.width = `${Math.min(326, width - 24)}px`;
  const anchor = menuTrigger.getBoundingClientRect();
  const menuHeight = menu.offsetHeight;
  const above = anchor.top - menuHeight - 8;
  const below = anchor.bottom + 8;
  const y = above >= top + 12 ? above : below + menuHeight <= top + height - 12 ? below : top + 12;
  menu.style.left = `${Math.max(left + 12, Math.min(anchor.right - menu.offsetWidth, left + width - menu.offsetWidth - 12))}px`;
  menu.style.top = `${y}px`;
}

function updateMenu() {
  const smartReply = smartReplyStates[activeCase];
  const hasDraft = input.value.length > 0;
  byId('generate-notes').disabled = false;
  byId('draft-warning').hidden = isNotes() || !hasDraft;
  menuActions.forEach(button => {
    button.disabled = hasDraft;
    if (button.dataset.tone) button.setAttribute('aria-pressed', String(button.dataset.tone === smartReply.tone));
  });
  positionMenu();
}

function closeMenu(restoreFocus = false) {
  menu.hidden = true;
  menuTrigger.setAttribute('aria-expanded', 'false');
  byId('context-explanation').hidden = true;
  byId('context-info').setAttribute('aria-expanded', 'false');
  if (restoreFocus) menuTrigger.focus();
}

function openMenu() {
  menu.hidden = false;
  menuTrigger.setAttribute('aria-expanded', 'true');
  updateMenu();
  (isNotes() ? (byId('generate-notes').disabled ? byId('menu-close') : byId('generate-notes')) : (menuActions.find(button => !button.disabled) || byId('context-info'))).focus();
}

function changeSuggestion(button) {
  if (isNotes() || input.value.length > 0) return;
  const smartReply = smartReplyStates[activeCase];
  if (button.dataset.tone) {
    smartReply.tone = button.dataset.tone;
    smartReply.variant = 0;
    smartReply.shortened = false;
  } else if (button.dataset.action === 'shorten') {
    smartReply.shortened = true;
  } else {
    const variants = smartReplySuggestions[activeCase][smartReply.tone][smartReply.shortened ? 'short' : 'full'];
    smartReply.variant = (smartReply.variant + 1) % variants.length;
  }
  editorState().suggestionAvailable = true;
  closeMenu();
  syncComposer();
  confirmSmartReply();
  input.focus();
  byId('announcement').textContent = 'SmartReply suggestion updated. Press Tab in the composer to accept.';
}

byId('menu-close').addEventListener('click', () => closeMenu(true));
[byId('smartreply-label'), byId('smartnotes-label')].forEach(trigger => trigger.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu(true)));
[byId('smartreply-label'), byId('smartnotes-label')].forEach(trigger => trigger.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); openMenu(); }
}));
menuActions.forEach(button => button.addEventListener('click', () => changeSuggestion(button)));
byId('context-info').addEventListener('click', () => {
  const explanation = byId('context-explanation');
  explanation.hidden = !explanation.hidden;
  byId('context-info').setAttribute('aria-expanded', String(!explanation.hidden));
  positionMenu();
});
menu.addEventListener('keydown', event => {
  const buttons = [...menu.querySelectorAll('button:not(:disabled)')].filter(button => !button.closest('[hidden]'));
  const index = buttons.indexOf(document.activeElement);
  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
  } else if (!isNotes() && event.key === 'Tab' && (event.shiftKey ? index === 0 : index === buttons.length - 1)) {
    event.preventDefault();
    closeMenu();
    (event.shiftKey ? menuTrigger : input).focus();
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) { event.preventDefault(); closeMenu(true); }
});
document.addEventListener('pointerdown', event => {
  if (!menu.hidden && !menu.contains(event.target) && !menuTrigger.contains(event.target)) closeMenu();
});
document.addEventListener('focusin', event => {
  if (!menu.hidden && !menu.contains(event.target) && event.target !== menuTrigger) closeMenu();
});
window.addEventListener('resize', positionMenu);
window.visualViewport?.addEventListener('resize', positionMenu);
window.visualViewport?.addEventListener('scroll', positionMenu);

// Attach listeners once; switching cases only updates state and renders content.
document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => selectCase(button.dataset.case)));
input.addEventListener('input', () => {
  storeActiveDraft();
  syncComposer();
});
input.addEventListener('keydown', event => {
  if (event.isComposing) return;
  if (!isNotes() && event.key === 'Tab' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey && editorState().suggestionAvailable && input.value.length === 0) {
    event.preventDefault();
    input.value = currentSuggestion();
    storeActiveDraft();
    editorState().suggestionAvailable = false;
    syncComposer();
    input.setSelectionRange(input.value.length, input.value.length);
    confirmSmartReply();
    byId('announcement').textContent = isNotes() ? 'SmartNotes accepted. Edit your private note before saving.' : 'SmartReply accepted. You can edit your reply before sending.';
  } else if (event.key === 'Enter' && !event.shiftKey && activeCase === 'chat' && !isNotes()) {
    event.preventDefault();
    sendReply();
  }
});
byId('reply-form').addEventListener('submit', event => { event.preventDefault(); sendReply(); });
const composerHeights = {chat: 220, email: 240};
const resizeHandle = byId('composer-resize');
const composerForm = byId('reply-form');
const composerRegion = byId('composer-region');
let composerDrag = null;

function composerLimits() {
  const workspace = conversation.getBoundingClientRect().height + composerRegion.getBoundingClientRect().height;
  const chrome = composerRegion.getBoundingClientRect().height - composerForm.getBoundingClientRect().height;
  const fraction = activeCase === 'email' ? .65 : .5;
  // In very short viewports, available space takes precedence over the minimum.
  const max = Math.max(0, Math.floor(Math.min(workspace * fraction, workspace - chrome - 60)));
  return {min: Math.min(activeCase === 'email' ? 160 : 110, max), max};
}

function applyComposerHeight(requested = composerHeights[activeCase], remember = false) {
  const {min, max} = composerLimits();
  const height = Math.max(min, Math.min(max, requested));
  if (remember) composerHeights[activeCase] = height;
  composerForm.style.height = `${height}px`;
  resizeHandle.setAttribute('aria-label', `Resize ${activeCase} reply composer`);
  resizeHandle.setAttribute('aria-valuemin', min);
  resizeHandle.setAttribute('aria-valuemax', max);
  resizeHandle.setAttribute('aria-valuenow', Math.round(height));
  resizeHandle.setAttribute('aria-valuetext', `${Math.round(height)} pixels`);
  positionMenu();
}

function finishComposerResize() {
  if (!composerDrag) return;
  const pointerId = composerDrag.pointerId;
  composerDrag = null;
  document.body.classList.remove('resizing-composer');
  resizeHandle.classList.remove('is-dragging');
  if (resizeHandle.hasPointerCapture(pointerId)) resizeHandle.releasePointerCapture(pointerId);
}

resizeHandle.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  event.preventDefault();
  resizeHandle.focus();
  composerDrag = {pointerId: event.pointerId, y: event.clientY, height: composerForm.getBoundingClientRect().height};
  resizeHandle.setPointerCapture(event.pointerId);
  resizeHandle.classList.add('is-dragging');
  document.body.classList.add('resizing-composer');
});
resizeHandle.addEventListener('pointermove', event => {
  if (!composerDrag || event.pointerId !== composerDrag.pointerId) return;
  applyComposerHeight(composerDrag.height + composerDrag.y - event.clientY, true);
});
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => resizeHandle.addEventListener(type, event => {
  if (composerDrag?.pointerId === event.pointerId) finishComposerResize();
}));
resizeHandle.addEventListener('keydown', event => {
  if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const {min, max} = composerLimits();
  const current = composerForm.getBoundingClientRect().height;
  applyComposerHeight(event.key === 'Home' ? min : event.key === 'End' ? max : current + (event.key === 'ArrowUp' ? 10 : -10), true);
});
function refreshComposerSize() { applyComposerHeight(); resizeEditor(); }
window.addEventListener('resize', refreshComposerSize);
window.addEventListener('blur', finishComposerResize);
new ResizeObserver(refreshComposerSize).observe(document.querySelector('.main'));

function configureComposerMode() {
  const notes = isNotes();
  byId('editor').hidden = notes;
  byId('notes-document').hidden = !notes;
  byId('composer-resize').hidden = false;
  if (notes) byId('notes-document').replaceChildren(cleanNoteContent(internalNotes.html));
  byId('composer-tabs').hidden = activeCase !== 'chat';
  byId('smartreply-label').hidden = notes;
  byId('smartnotes-label').hidden = !notes;
  menuTrigger = byId(notes ? 'smartnotes-label' : 'smartreply-label');
  byId('reply-form').classList.toggle('notes-mode', notes);
  byId('reply-label').setAttribute('for', notes ? 'notes-document' : 'reply-input');
  byId('reply-label').textContent = notes ? 'Internal Notes' : 'Reply to ' + cases[activeCase].name;
  byId('reply-label').classList.toggle('sr-only', activeCase === 'chat');
  byId('send-label').textContent = notes ? 'Save Note' : 'Send reply';
  byId('send-button').querySelector('svg').style.display = notes ? 'none' : '';
  byId('composer-help').textContent = notes ? 'Private demo note. Use Save Note to save.' : activeCase === 'email' ? 'Enter for a new line. Use Send reply to send.' : 'Enter to send / Shift + Enter for a new line';
  byId('refine-title').textContent = notes ? 'SmartNotes' : 'SmartReply';
  menu.querySelector('.menu-brand-copy p').textContent = notes ? 'Generate structured case documentation' : 'Refine your response';
  menuActions.forEach(button => button.hidden = notes);
  byId('reply-context').hidden = notes;
  byId('generate-notes').hidden = !notes;
  byId('notes-context').hidden = !notes;
  byId('robot-details').hidden = activeCase !== 'chat';
  byId('robot-product').textContent = demoDetails.product;
  byId('robot-serial').textContent = 'SN: ' + demoDetails.serial;
  document.querySelectorAll('[data-mode]').forEach(button => {
    const selected = button.dataset.mode === chatTab;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
}
function switchComposerTab(mode) {
  if (activeCase !== 'chat' || mode === chatTab) return;
  closeMenu();
  storeActiveDraft();
  finishComposerResize();
  chatTab = mode;
  input.value = editorState().draft;
  byId('editor').scrollTop = 0;
  configureComposerMode();
  syncComposer();
  applyComposerHeight();
}
function renderInternalNote(message) {
  const card = element('article', 'internal-note');
  const header = element('div', 'internal-note-heading');
  const icon = byId('notes-tab').querySelector('svg').cloneNode(true);
  const time = element('time', '', message.time);
  time.dateTime = message.sentAt;
  header.append(avatar('agent'), icon, element('strong', '', 'Internal Note'), element('span', 'private-label', 'Private'), time);
  const body = element('div', 'note-body notes-document');
  if (message.html) body.append(cleanNoteContent(message.html));
  else body.textContent = message.text;
  card.append(header, body);
  return card;
}
function saveInternalNote() {
  const doc = byId('notes-document');
  const text = doc.innerText.trim();
  if (!text) return;
  const now = new Date();
  const note = {role: 'note', text, html: safeNoteHTML(), time: now.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'}), sentAt: now.toISOString()};
  cases.chat.messages.push(note);
  internalNotes.draft = '';
  internalNotes.html = '';
  doc.replaceChildren();
  internalNotes.suggestionAvailable = false;
  thread.append(renderInternalNote(note));
  input.value = '';
  syncComposer();
  scrollToLatest();
  byId('announcement').textContent = 'Private internal note saved to this demo case.';
  doc.focus();
}
// Keep only simple document markup; external pasted content is inserted as text.
function cleanNoteContent(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const fragment = document.createDocumentFragment();
  const allowed = new Set(['P', 'DIV', 'STRONG', 'B', 'EM', 'I', 'BR', 'H3', 'H4', 'HR', 'UL', 'OL', 'LI']);
  function copy(node, parent) {
    if (node.nodeType === 3) { parent.append(document.createTextNode(node.textContent)); return; }
    if (node.nodeType !== 1 || ['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT'].includes(node.tagName)) return;
    const target = allowed.has(node.tagName) ? document.createElement(node.tagName.toLowerCase()) : document.createDocumentFragment();
    [...node.childNodes].forEach(child => copy(child, target));
    parent.append(target);
  }
  [...template.content.childNodes].forEach(node => copy(node, fragment));
  return fragment;
}
function safeNoteHTML() {
  const holder = document.createElement('div');
  holder.append(cleanNoteContent(byId('notes-document').innerHTML));
  return holder.innerHTML;
}
function storeActiveDraft() {
  if (isNotes()) {
    internalNotes.draft = byId('notes-document').innerText;
    internalNotes.html = safeNoteHTML();
  } else cases[activeCase].draft = input.value;
}
function generateNoteDocument() {
  const doc = byId('notes-document');
  if (doc.textContent.trim() && !window.confirm('Replace your existing internal note draft with generated documentation?')) return;
  const fields = [['Customer Name:', demoDetails.name], ['Customer Email:', demoDetails.email], ['Serial Number:', demoDetails.serial], ['RMA#:', demoDetails.rma], ['Replacement Order #:', demoDetails.replacement], ['Dixa ID:', demoDetails.caseId]];
  doc.replaceChildren();
  fields.forEach(([label, value]) => {
    const line = element('p');
    line.append(element('strong', '', label), document.createTextNode(' ' + value));
    doc.append(line);
  });
  const notesLabel = element('p');
  notesLabel.append(element('strong', '', 'Notes:'));
  doc.append(notesLabel, element('p', '', noteSummary));
  storeActiveDraft();
  closeMenu();
  syncComposer();
  confirmSmartReply();
  doc.focus({preventScroll: true});
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(doc);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  doc.scrollTop = 0;
  byId('announcement').textContent = 'Structured internal documentation generated. Edit the document before saving.';
}
byId('generate-notes').addEventListener('click', () => { if (isNotes()) generateNoteDocument(); });
byId('notes-document').addEventListener('input', () => { storeActiveDraft(); syncComposer(); });
byId('notes-document').addEventListener('paste', event => {
  event.preventDefault();
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const text = document.createTextNode(event.clipboardData.getData('text/plain'));
  range.insertNode(text);
  range.setStartAfter(text);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  storeActiveDraft(); syncComposer();
});
byId('notes-document').addEventListener('drop', event => event.preventDefault());
document.querySelector('.main').addEventListener('scroll', positionMenu);
document.querySelectorAll('[data-mode]').forEach(button => {
  button.addEventListener('click', () => switchComposerTab(button.dataset.mode));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const mode = event.key === 'Home' ? 'reply' : event.key === 'End' ? 'notes' : chatTab === 'reply' ? 'notes' : 'reply';
    switchComposerTab(mode);
    byId(mode === 'reply' ? 'reply-tab' : 'notes-tab').focus();
  });
});

selectCase('chat');
