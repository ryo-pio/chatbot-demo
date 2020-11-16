import React, {useState, useEffect, useCallback} from 'react';
import './assets/styles/style.css';
import {AnswersList, Chats} from './components/index';
import FormDialog from './components/forms/FormDialog';
import {db} from './firebase/index';

const App = () => {

  const [answers, setAnswers] = useState([]);            // 回答コンポーネントに表示するデータ
  const [chats, setChats] = useState([]);                // チャットコンポーネントに表示するデータ
  const [currentId, setCurrentId] = useState('init');    // 現在の質問ID
  const [dataset, setDataset] = useState({});            // 質問と回答のデータセット
  const [open, setOpen] = useState(false);

  // 次の質問をチャットエリアに表示する関数
  const displayNextQuestion = (nextQuestionId, nextDataset) => {
    // 選択された回答と次の質問をチャットに追加
    addChats({
        text: nextDataset.question,
        type: 'question'
    });
    // 次の回答一覧をセット
    setAnswers(nextDataset.answers)
    // 現在の質問IDをセット
    setCurrentId(nextQuestionId)
  }

  const selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch(true) {
      case (/^https:*/.test(nextQuestionId)): //正規表現からurlかどうかを判定
        const a = document.createElement('a'); // aタグを生成する
        a.href = nextQuestionId;
        a.target = "_blank";
        a.click(); // 強制クリックでページを開く
        break;
      case ( nextQuestionId === "contact"):
        handleClickOpen();
        break;
      default:
        addChats({
          text: selectedAnswer,
          type: "answer"
        })
        setTimeout(() => displayNextQuestion(nextQuestionId, dataset[nextQuestionId]), 500); // 応答の遅延実行
        // this.displayNextQuestion(nextQuestionId);
        break;
    }
  }

  const addChats = (chat) => {
    setChats(prevChats => { // prevChats: 前回stateのチャットを引数に取れる
      return [...prevChats, chat] // 前回のチャットに対して今回のものを配列に追加するよ
    })
  }

  const handleClickOpen = () => {
    setOpen(true)
  };

  const handleClose = useCallback(() => { // 子コンポーネントに関数を渡しているからcallBack関数にするべき
    setOpen(false)
  }, [setOpen]);

  // 最初の質問をチャットエリアに表示する
  useEffect(() => {
    (async() => {
        const initDataset = {};
        // Fetch questions dataset from Firestore
        await db.collection('questions').get().then(snapshots => {
            snapshots.forEach(doc => {
                initDataset[doc.id] = doc.data()
            })
        });
        // Firestoreから取得したデータセットを反映
        setDataset(initDataset);
        // 最初の質問を表示
        displayNextQuestion(currentId, initDataset[currentId])
    })();
  }, []);

  useEffect(() => { // この処理は毎回呼びたいから第二引数は付けない
    const scrollArea = document.getElementById("scroll-area");
    if(scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight // 自動スクロール
    }
  })

  return (
    <section className="c-section">
      <div className="c-box">
        <Chats chats={chats} />
        <AnswersList answers={answers} select={selectAnswer} />
        <FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  );
}

export default App