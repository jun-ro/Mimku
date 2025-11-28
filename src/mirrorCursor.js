const editor = document.getElementById("editor");
const mirror = document.getElementById("mirror");
const ghost = document.getElementById("ghost-caret");

function syncStyles() {
    const style = window.getComputedStyle(editor);
    
    const props = [
        'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight',
        'letterSpacing', 'wordSpacing', 'textIndent',
        'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
        'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
        'marginTop', 'marginLeft', 'marginRight', 'marginBottom',
        'width', 'height', 'boxSizing', 'overflow', 'overflowY',
        'whiteSpace', 'wordWrap', 'verticalAlign'
    ];
    
    props.forEach((prop) => {
        mirror.style[prop] = style[prop];
    });
    mirror.style.width = editor.clientWidth + 'px';
    
    mirror.style.boxSizing = 'border-box';
}

function updateCaret() {
    const text = editor.value;
    const caretPos = editor.selectionStart;

    const before = text.slice(0, caretPos);
    const after = text.slice(caretPos);
    
    mirror.textContent = before;
    
    const marker = document.createElement("span");
    marker.innerHTML = "&#8203;"; 
    marker.style.cssText = "display: inline; width: 0; height: 0; overflow: hidden;";
    mirror.appendChild(marker);
    mirror.append(after);

    const markerRect = marker.getBoundingClientRect();
    const editorRect = editor.getBoundingClientRect();

    const x = markerRect.left - editorRect.left + editor.scrollLeft;
    const y = markerRect.top - editorRect.top + editor.scrollTop;

    ghost.style.transform = `translate(${x}px, ${y}px)`;
    
    const lineHeight = window.getComputedStyle(editor).lineHeight;
    ghost.style.height = (lineHeight === 'normal' ? parseFloat(getComputedStyle(editor).fontSize) * 1.2 : parseFloat(lineHeight)) + 'px';


    ghost.style.opacity = editor.selectionStart === editor.selectionEnd ? '1' : '0';
}


syncStyles();
updateCaret();

['input', 'keydown', 'keyup', 'click', 'focus', 'mousedown', 'mouseup', 'scroll', 'select'].forEach(ev =>
    editor.addEventListener(ev, () => requestAnimationFrame(updateCaret))
);

window.addEventListener('resize', () => {
    syncStyles();
    requestAnimationFrame(updateCaret);
});