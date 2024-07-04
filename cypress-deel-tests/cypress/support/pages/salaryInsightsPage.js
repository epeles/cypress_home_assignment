// cypress/pages/salaryInsightsPage.js

class SalaryInsightsPage {
    visit() {
      cy.visit('https://growth.deel.training/dev/salary-insights');
    }
  
    selectRole(role) {
      cy.get("input[name='role']").click();
      cy.get(`li[data-text='${role}']`).click();
    }
  
    selectCountry(country) {
      cy.get("input[name='country']").click();
      cy.contains('p', country).click();
    }
  
    submitForm() {
      cy.get('button[type="submit"]').click();
    }
  
    verifyResults(country, role) {
      const locatorsText = ['h2', 'h3', 'p'];
      locatorsText.forEach(locator => {
        cy.get(locator)
          .should('contains.text', country)
          .and('contains.text', role);
      });
    }
  
    verifyFlag(flagSrc) {
      cy.get(`img[src='https://s3.us-east-1.amazonaws.com/media.letsdeel.com/flags/${flagSrc}']`).should('be.visible');
    }
  
    interceptApiCall() {
      cy.intercept('POST', 'https://api.eu.amplitude.com/2/httpapi').as('apiCall');
    }
  
    verifyApiCall(countryAbbr, role) {
      cy.wait('@apiCall').then(req => {
        expect(req.response.statusCode).to.equal(200);
        const eventProperties = req.request.body.events[0].event_properties;
        expect(eventProperties.country).to.equal(`${countryAbbr}`);
        expect(eventProperties.postion).to.equal(`${role}`);
      });
    }
  
    verifyValidationMessages(errorMsg) {
      errorMsg.forEach(msg => {
        cy.get('p').contains(`${msg} is required`)
          .should('have.css', 'color', 'rgb(227, 0, 4)')
          .and('have.css', 'font-size', '12px')
          .and('have.css', 'font-weight', '400');
      });
    }
  
    clearInputs() {
      cy.get("button[title='Clear']").each(($el) => {
        cy.wrap($el).click({ force: true });
      });
    }
  }
  
  export default SalaryInsightsPage;