const ExcelQ = {
    topic: 'Excel',
    level: 'Beginner',
    totalQuestions: 15,
    perQuestionScore: 1,
    questions: [
       {
         question:
           'Formulas in Excel start with ________',
         choices: ['/', 'f', '-', '='],
         type: 'MCQs',
         correctAnswer: '=',
       },
       {
         question:
           'Which shortcut key is used to remove all borders?',
         choices: ['Shift + _ (Underline)','Shift + F1', 'Ctrl +Right Arrow key','None of the Above'],
         type: 'MCQs',
         correctAnswer: 'Shift + _ (Underline)',
       },
       {
         question:
           'Which shortcut key is used format number in date format?',
         choices: [ 'Shift + #','Ctrl + Shift + #','Ctrl +Right Arrow key','Shift + F1'],
         type: 'MCQs',
         correctAnswer: 'Ctrl + Shift + #',
       },
       {
         question: 'Which shortcut key is used to edit a comment?',
         choices: ['Ctrl +Right Arrow Key','Shift +F1','Shift+F2','Ctrl+Shift'],
         type: 'MCQs',
         correctAnswer: 'Shift+F2',
       },
       {
         question: 'Which shortcut key is for auto sum? ',
         choices: ['Alt + =' , 'Ctrl + Shift' , 'Alt + F1' , 'Ctrl + ='],
         type: 'MCQs',
         correctAnswer: 'Alt + ='     
        },
       {
         question: 'To insert chart from a data selection, you will need to press',
         choices: ['F5' , 'F7', 'F11' , 'F12'],
         type: 'MCQs',
         correctAnswer: 'F11',
       },
       {
         question: 'To find the maximum amount, you can use',
         choices: ['=MAX(F5:F24)','=LARGE(F5:F24,1)','=AGGREGATE(4,0,F5:F24)','All of the Above'],
         type: 'MCQs',
         correctAnswer: 'All of the above',
       },
       {
         question: 'The total value of for the a particular group of database can be calculated by using',
         choices: ['SUMIF', 'IFS', 'MAX', 'INDEX-MATCH'],
         type: 'MCQs',
         correctAnswer: 'SUMIF',
       },
      {
        question: 'To return value from the left side of the matched value, we can use',
        choices: ['VLOOKUP' , 'Combination of VLOOKUP and IF Functions', 
        'HLOOKUP' , 'ZLOOKUP' ],
        type: 'MCQs',
        correctAnswer: 'VLOOKUP',
      },
      {
        question: 'Which of the formulas will you use to round up the amount figure from cell F17 to the nearest thousand? ',
        choices: ['=MROUND(F17,1000)','=FLOOR.MATH(F17,1000)','=CEILING.MATH(F17,1000)','=ROUNDUP(F17,1000)'],
        type: 'MCQs',
        correctAnswer: '=MROUND(F17,1000)',
      },
      {
        question: 'To find the string size (number of characters) for the name column, you will use',
        choices: ['=LEN(B5:B24)','=SIZE(B5:B24)','=STRINGLENGTH(B5:B24)','=LENGTH(B5:B24)'],
        type: 'MCQs',
        correctAnswer: '=STRINGLENGTH(B5:B24)',
      },
      {
        question: 'Which function can be used to determine the number of empty cells in the dataset?',
        choices: ['COUNT', 'COUNTA', 'COUNTABLANK', 'COUNTBLANT'],
        type: 'MCQs',
        correctAnswer: 'COUNTABLANK',
      },
      {
        question: 'Which key is used with CTRL to copy selected cells?',
        choices: ['D', 'A', 'C', 'B'],
        type: 'MCQs',
        correctAnswer: 'C',
      },
      {
        question: ' In Excel which shortcut key is used to go to the formulas tab?',
        choices: ['Alt+M', 'Ctrl+C', 'Ctrl+B', 'Ctrl+M'],
        type: 'MCQs',
        correctAnswer: 'Alt+M',
      },
      {
        question: 'What is the row limit of MS Excel 2019?',
        choices: ['4,81,0576', '1,048,576','1,57,648', '1,63, 84'],
        type: 'MCQs',
        correctAnswer: '1,048,576',
      },
     
    ],
  }
export default ExcelQ