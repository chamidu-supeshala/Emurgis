import { Template } from "meteor/templating"

import "./problemForm.html"

const maxCharValue = (inputId) => {
    if(inputId === 'summary') { return (62 - 'problem: '.length) }
    return 500
}

Template.problemForm.events({
    'keyup .form-control' (event) {
        event.preventDefault()
    
        let inputId = event.target.id
        let inputValue = event.target.value
        let inputMaxChars = maxCharValue(inputId) - parseInt(inputValue.length)
        let charsLeftText = inputMaxChars + ' characters left'
    
        $('#' + inputId + '-chars').text(charsLeftText)
    
        if (inputMaxChars <= 0) { 
          $('#' + inputId).keypress((e) => { return false })
          return true
        } 
        
        $('#' + inputId).unbind('keypress') 
    },
})