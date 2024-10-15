const JavaQ = {
    topic: 'Java',
    level: 'Beginner',
    totalQuestions: 10,
    perQuestionScore: 1,
    questions: [
       {
         question:
           'Which of these literals can be contained in a float data type variable?',
         choices: ['-3.4e+050', '+1.7e+308', '-3.4e+038','-7.7e+308'],
         type: 'MCQs',
         correctAnswer: '-3.4e+038',
       },
       {
         question:
           'Which of the following operators can operate on a boolean variable?                      A) && B) == C) ?: D)+=',
         choices: ['C & D','A & D', 'A, B & D','A, B & C'],
         type: 'MCQs',
         correctAnswer: 'A, B & C',
       },
       {
         question:
           'Exception generated in try block is caught in ……block',
         choices: [ 'Catch','Throw','Throws','finally'],
         type: 'MCQs',
         correctAnswer: 'Catch',
       },
       {
         question: '_________ method cannot be overridden',
         choices: ['Super','Static','Final','Private'],
         type: 'MCQs',
         correctAnswer: 'Final',
       },
       {
         question: 'Which of the following constructor of class Thread is Valid One?',
         choices: ['Thread(Runnable threadOb, int priority)' , 'Thread(int priority)' , 'Thread(Runnable threadOb, String threadName)' , 'None of the Above'],
         type: 'MCQs',
         correctAnswer: 'Thread(Runnable threadOb, String threadName)'     
        },
       {
         question: 'Which keyword when applied on a method indicates that only one thread should execute the method at a time.',
         choices: ['Volatile' , 'Synchronized', 'Native' , 'Static'],
         type: 'MCQs',
         correctAnswer: 'Synchronized',
       },
       {
         question: 'What is Math.floor(3.6) ?',
         choices: ['3.0','3','4','4.0'],
         type: 'MCQs',
         correctAnswer: '3.0',
       },
       {
         question: 'Public class Test{}                                                                                                What is the prototype of the default constructor?',
         choices: ['Public Test(void)','Test()','Test(void)','Public Test()'],
         type: 'MCQs',
         correctAnswer: 'Public Test()',
       },
      {
        question: 'A method within a class is only accessible by classes that are defined within the same package as the class of the method. Which one of the following is used to enforce such restriction ?',
        choices: ['Declare the method with the keyword public' , 'Declare the method with the keyword private', 
        'Declare the method with keyword protected' , 'Do not declare the method with any accessibility modifiers' ],
        type: 'MCQs',
        correctAnswer: 'Do not declare the method with any accessibility modifiers',
      },
      {
        question: 'Which one is a template for creating different objects ? ',
        choices: ['An arrary','A class','Interface','Method'],
        type: 'MCQs',
        correctAnswer: 'A class',
      },
      {
        question: 'What will be the error in the following Java code?        byte b = 50; b = b* 50;',
        choices: ['b cannot contain value 50','b cannot contain value 100, limited by its range','No error in this code','* operator has converted b * 50 into int, which can not be converted to byte without casting'],
        type: 'MCQs',
        correctAnswer: '* operator has converted b * 50 into int, which can not be converted to byte without casting',
      },
      {
        question: 'Which of this method is used to change an element in a LinkedList Object?',
        choices: ['change()','set()','redo()','add()'],
        type: 'MCQs',
        correctAnswer: 'set()',
      },
      {
        question: 'What is garbage collection in java?',
        choices: ['Method to manage memory in java','Create new garbage values','Delete All values','All of these'],
        type: 'MCQs',
        correctAnswer: 'Method to manage memory in java',
      },
      {
        question: 'Which of the following for loop declaration is not valid?',
        choices: ['for ( int i = 99; i >= 0; i / 9 )','for ( int i = 7; i <= 77; i += 7 )','for ( int i = 20; i >= 2; - -i )','for ( int i = 2; i <= 20; i = 2* i )'],
        type: 'MCQs',
        correctAnswer: 'for ( int i = 99; i >= 0; i / 9 )',
      },
      {
        question: 'How does one identify if a compilation unit is an interface or class from a .class file?',
        choices: ['Extension of the compilation unit','Java source file header','The class and interface cannot be differentiated','The unit type must be used to postfix interface or class name'],
        type: 'MCQs',
        correctAnswer: 'Java source file header',
      },
     
    ],
  }
export default JavaQ