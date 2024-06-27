import roleAndCountry from '../../fixtures/roleAndCountry.json'
describe('Salary Insights', () => {
  const baseUrl = 'https://growth.deel.training/dev/salary-insights';

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.fixture('roleAndCountry').as('roleAndCountry');
  });
 
  roleAndCountry.roles.forEach(({ role, country, countryAbbr, flagSrc }) => {
    it(`Should display salary insights for ${role} in ${country}`, () => {
      cy.wait(1500);
      cy.get("input[name='role']").click(); // Select the role
      cy.get(`li[data-text='${role}']`).click();
      cy.get("input[name='country']").click(); // Select the country
      cy.contains('p', country).click()   
      cy.get('button[type="submit"]').click(); // Submit the form

      // Check that the correct country and role are displayed in the results
      const locatorsText = ['h2','h3','p']
      locatorsText.forEach(locator => {
        cy.get(locator)
        .should('contains.text',country)
        .and('contains.text',role);
      })
      //Check that the according flag is displayed
      cy.get(`img[src='https://s3.us-east-1.amazonaws.com/media.letsdeel.com/flags/${flagSrc}']`).should('be.visible')

      cy.intercept('POST', 'https://api.eu.amplitude.com/2/httpapi').as('apiCall');
      // Wait for the API call and assert the payload
      cy.wait('@apiCall').then(req => {
        expect(req.response.statusCode).to.equal(200); // assert the response is ok
        const eventProperties = req.request.body.events[0].event_properties;
        expect(eventProperties.country).to.equal(`${countryAbbr}`); // Assert the country
        expect(eventProperties.postion).to.equal(`${role}`);  // Assert the role
      });
    });
  });

  it('Should display a validation message for empty input field', () => {
    //make sure the fields are empty
    cy.get("input").first().should('have.value', '') 
    cy.get("input").last().should('have.value', '')
    cy.get('button[type="submit"]').click();
    
    const errorMsg = ['Role', 'Country']   
    errorMsg.forEach(msg => {
      cy.get('p').contains(`${msg} is required`)
      .should('have.css', 'color', 'rgb(227, 0, 4)')
      .and('have.css', 'font-size', '12px' )
      .and('have.css', 'font-weight', '400' )
    })
  });

  it('Clear button test', () => {
    cy.wait(1500)
    cy.get("input[name='role']").click();
    cy.get("li[data-text='Accountant']").click()
    cy.get("input[name='country']").click();
    cy.contains('p', 'Brazil').click()
    cy.get("button[title='Clear']").first().click({force: true})
    cy.get("input[name='role']").should('have.value', '') //make sure the input is empty
    cy.get("button[title='Clear']").last().click({force: true})
    cy.get("input[name='country']").should('have.value', '') //make sure the input is empty
  });  
});