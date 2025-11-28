const editor = document.getElementById("editor");
const mirror = document.getElementById("mirror");
const ghost = document.getElementById("ghost-caret");

function updateMirrorStyle() {
    const s = getComputedStyle(editor);
    const props = [
        "font-size","font-family","line-height","padding",
        "border","box-sizing","white-space","letter-spacing",
        "word-break","width","font-weight"
    ];
    props.forEach(p => mirror.style[p] = s[p]);
}
updateMirrorStyle();
window.addEventListener("resize", updateMirrorStyle);

function updateCaret() {
    const text = editor.value;
    const caretPos = editor.selectionStart;

    // 1. Mirror Logic
    const before = text.slice(0, caretPos);
    const after  = text.slice(caretPos);
    
    mirror.textContent = before;
    const marker = document.createElement("span");
    marker.textContent = "|";
    marker.style.cssText = "display: inline-block; width: 0; overflow: hidden;"; 
    mirror.appendChild(marker);
    mirror.append(after);

    // 2. Position Calculation
    const markerRect = marker.getBoundingClientRect();
    const mirrorRect = mirror.getBoundingClientRect();
    
    const x = (markerRect.left - mirrorRect.left) - editor.scrollLeft;
    const y = (markerRect.top - mirrorRect.top) - editor.scrollTop;

    // 3. Apply styles
    ghost.style.transform = `translate(${x}px, ${y}px)`;
    ghost.style.height = parseFloat(getComputedStyle(editor).lineHeight) + "px";

    // 4. Hide on selection, show otherwise (solid)
    if (editor.selectionStart !== editor.selectionEnd) {
        ghost.style.opacity = 0;
    } else {
        ghost.style.opacity = 1;
    }
}

["input", "keydown", "keyup", "click", "focus", "scroll"].forEach(ev =>
    editor.addEventListener(ev, () => window.requestAnimationFrame(updateCaret))
);

setTimeout(updateCaret, 10);