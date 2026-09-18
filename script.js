const levels = [
  { title: 'ההמראה הראשונה', instruction: 'סדרו את החלליות בשורה אופקית. מקמו את כולן במרכז הלוח.', tip: 'ב־row החלליות נעות משמאל לימין. כתבו center גם ב־justify-content וגם ב־align-items.', target: 'שורה · מרכז · מרכז', values: { direction: 'row', justify: 'center', align: 'center', wrap: 'nowrap' } },
  { title: 'מסדר הכוכבים', instruction: 'השאירו את החלליות בשורה אחת. פזרו ביניהן רווח שווה והצמידו אותן לתחתית.', tip: 'space-between יוצר רווח שווה בין החלליות. כדי להגיע לתחתית, השתמשו ב־flex-end ב־align-items.', target: 'שורה · רווח שווה · למטה', values: { direction: 'row', justify: 'space-between', align: 'flex-end', wrap: 'nowrap' } },
  { title: 'מגדל השיגור', instruction: 'סדרו את החלליות בטור. הטור צריך להיות באמצע הלוח, גם למעלה־למטה וגם מצד לצד.', tip: 'אחרי שבוחרים column, כיוון התנועה הוא מלמעלה למטה. לכן center ב־justify-content ממקם את הטור באמצע הגובה.', target: 'עמודה · מרכז · מרכז', values: { direction: 'column', justify: 'center', align: 'center', wrap: 'nowrap' } },
  { title: 'רוח גבית', instruction: 'סדרו את החלליות בטור הפוך: התחילו מלמטה והצמידו את הטור לצד ימין.', tip: 'column-reverse הופך את כיוון הטור. flex-start מציב בתחילת הכיוון החדש, ו־flex-end מצמיד לצד ימין.', target: 'עמודה הפוכה · התחלה · סוף', values: { direction: 'column-reverse', justify: 'flex-start', align: 'flex-end', wrap: 'nowrap' } },
  { title: 'חגורת האסטרואידים', instruction: 'אפשרו לחלליות לרדת לשורה נוספת. פזרו אותן ברווחים שווים ומרכזו אותן לגובה.', tip: 'wrap מאפשר ירידת שורה. space-evenly מחלק את הרווחים באופן שווה גם בקצוות.', target: 'שורה · רווח אחיד · מרכז · גלישה', values: { direction: 'row', justify: 'space-evenly', align: 'center', wrap: 'wrap' } },
  { title: 'שער הגלקסיה', instruction: 'הפכו את כיוון השורה, השאירו רווח סביב כל חללית, והצמידו את השורה לחלק העליון.', tip: 'row-reverse הופך את סדר החלליות. space-around מוסיף רווח סביב כל פריט, ו־flex-start מצמיד למעלה.', target: 'שורה הפוכה · רווח מסביב · למעלה', values: { direction: 'row-reverse', justify: 'space-around', align: 'flex-start', wrap: 'nowrap' } }
];

const elements = { board: document.querySelector('#gameBoard'), score: document.querySelector('#score'), progressText: document.querySelector('#progressText'), progressBar: document.querySelector('#progressBar'), levelNumber: document.querySelector('#levelNumber'), levelTitle: document.querySelector('#levelTitle'), levelInstruction: document.querySelector('#levelInstruction'), levelTip: document.querySelector('#levelTip'), targetSummary: document.querySelector('#targetSummary'), attempts: document.querySelector('#attempts'), currentLevel: document.querySelector('#currentLevel'), boardLabel: document.querySelector('#boardLabel'), feedback: document.querySelector('#feedback'), levelList: document.querySelector('#levelList'), editor: document.querySelector('#codeEditor') };
const flexProperties = ['display', 'flexDirection', 'justifyContent', 'alignItems', 'flexWrap'];
const starterCode = `display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: stretch;
flex-wrap: nowrap;`;
let state = JSON.parse(localStorage.getItem('flexMissionState') || 'null') || { current: 0, score: 0, completed: [], attempts: {} };

function renderBoard() {
  if (!elements.board.children.length) {
    ['A', 'B', 'C', 'D', 'E'].forEach(label => {
      const ship = document.createElement('div');
      ship.className = 'ship';
      ship.innerHTML = `<span>${label}</span>`;
      elements.board.appendChild(ship);
    });
  }
}
function readCode() {
  const styles = document.createElement('div').style;
  styles.cssText = elements.editor.value;
  return { display: styles.display, flexDirection: styles.flexDirection, justifyContent: styles.justifyContent, alignItems: styles.alignItems, flexWrap: styles.flexWrap };
}
function applyCode() {
  renderBoard();
  const values = readCode();
  elements.board.style.display = values.display || 'flex';
  elements.board.style.flexDirection = values.flexDirection || 'row';
  elements.board.style.justifyContent = values.justifyContent || 'flex-start';
  elements.board.style.alignItems = values.alignItems || 'stretch';
  elements.board.style.flexWrap = values.flexWrap || 'nowrap';
  return values;
}
function renderLevelButtons() {
  elements.levelList.innerHTML = '';
  levels.forEach((level, index) => {
    const button = document.createElement('button');
    button.className = 'level-button' + (index === state.current ? ' active' : '') + (state.completed.includes(index) ? ' completed' : '') + (index > Math.max(...state.completed, -1) + 1 ? ' locked' : '');
    button.textContent = String(index + 1).padStart(2, '0');
    button.setAttribute('aria-label', `עבור לשלב ${index + 1}`);
    button.disabled = index > Math.max(...state.completed, -1) + 1;
    button.addEventListener('click', () => loadLevel(index));
    elements.levelList.appendChild(button);
  });
}
function loadLevel(index) {
  state.current = index;
  const level = levels[index];
  elements.editor.value = starterCode;
  elements.levelNumber.textContent = String(index + 1).padStart(2, '0');
  elements.currentLevel.textContent = index + 1;
  elements.boardLabel.textContent = `SECTOR ${String(index + 1).padStart(2, '0')}`;
  elements.levelTitle.textContent = level.title;
  elements.levelInstruction.textContent = level.instruction;
  elements.levelTip.textContent = level.tip;
  elements.targetSummary.textContent = level.target;
  elements.attempts.textContent = state.attempts[index] || 0;
  elements.feedback.textContent = '';
  elements.feedback.className = 'feedback';
  applyCode();
  renderLevelButtons();
  saveState();
}
function saveState() { localStorage.setItem('flexMissionState', JSON.stringify(state)); }
function updateProgress() {
  const completeCount = state.completed.length;
  elements.score.textContent = state.score;
  elements.progressText.textContent = `${completeCount} / ${levels.length}`;
  elements.progressBar.style.width = `${completeCount / levels.length * 100}%`;
}
function checkSolution() {
  const level = levels[state.current];
  state.attempts[state.current] = (state.attempts[state.current] || 0) + 1;
  elements.attempts.textContent = state.attempts[state.current];
  const values = applyCode();
  const correct = values.display === 'flex' && Object.entries(level.values).every(([key, value]) => {
    const property = { direction: 'flexDirection', justify: 'justifyContent', align: 'alignItems', wrap: 'flexWrap' }[key];
    return values[property] === value;
  });
  if (correct) {
    const firstSolve = !state.completed.includes(state.current);
    if (firstSolve) { state.completed.push(state.current); state.score += Math.max(100 - (state.attempts[state.current] - 1) * 10, 40); }
    elements.feedback.textContent = firstSolve ? 'מסלול מדויק. שער המעבר נפתח!' : 'המסלול עדיין מדויק. אפשר לבחור שלב אחר.';
    elements.feedback.className = 'feedback success';
    elements.board.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.015)' }, { transform: 'scale(1)' }], { duration: 450 });
    updateProgress(); renderLevelButtons(); saveState();
    if (state.current < levels.length - 1) {
      const solvedLevel = state.current;
      setTimeout(() => {
        if (state.current === solvedLevel) loadLevel(solvedLevel + 1);
      }, 900);
    } else {
      elements.feedback.textContent = 'כל המשימות הושלמו. אתם מוכנים לניווט בגלקסיה!';
    }
  } else {
    elements.feedback.textContent = 'המסלול לא תואם עדיין. כוונו מחדש את המערכות ונסו שוב.';
    elements.feedback.className = 'feedback error';
  }
}
function resetLevel() { elements.editor.value = starterCode; state.attempts[state.current] = 0; elements.attempts.textContent = '0'; elements.feedback.textContent = ''; elements.feedback.className = 'feedback'; applyCode(); saveState(); }
document.querySelector('#runButton').addEventListener('click', () => { applyCode(); elements.feedback.textContent = 'הקוד הורץ על הלוח.'; elements.feedback.className = 'feedback'; });
elements.editor.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); applyCode(); } });
document.querySelector('#checkButton').addEventListener('click', checkSolution);
document.querySelector('#resetButton').addEventListener('click', resetLevel);
updateProgress(); elements.editor.value = starterCode; loadLevel(state.current);
