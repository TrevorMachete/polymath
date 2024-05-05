// Function to add a new question to the user's "questions" collection
function addQuestionToUser(userId, question, correctAnswer, userAnswer) {
    let questionsCollectionRef = db.collection('users').doc(userId).collection('questions');
  
    questionsCollectionRef.add({
      question: question,
      correctAnswer: correctAnswer,
      userAnswer: userAnswer
    }).then((docRef) => {
      console.log("Question document created with ID: ", docRef.id);
    }).catch((error) => {
      console.error("Error adding question document: ", error);
    });
  }
  