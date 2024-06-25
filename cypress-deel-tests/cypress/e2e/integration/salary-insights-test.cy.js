require('cypress-xpath')
import roleAndCountry from '../../fixtures/roleAndCountry.json'
describe('Salary Insights', () => {
  const baseUrl = 'https://growth.deel.training/dev/salary-insights';

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.fixture('roleAndCountry').as('roleAndCountry');
  });
 
  roleAndCountry.roles.forEach(({ role, country, countryAbbr, flagSrc }) => {
    it(`Should display salary insights for ${role} in ${country}`, () => {
      cy.wait(2500);

      // Select the role
      cy.get("input[name='role']").click();
      cy.get(`li[data-text='${role}']`).click();

      // Select the country
      cy.get('input[name="country"]').type(`${country}{downArrow}{enter}`);

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Check that the correct country and role are displayed in the results
      cy.contains('h2', country).should('be.visible');
      cy.contains('p', country).should('be.visible');
      cy.contains('h2', role).should('be.visible');
      cy.contains('p', role).should('be.visible');
      //Check that the according flag is displayed
      cy.get(`img[src='https://s3.us-east-1.amazonaws.com/media.letsdeel.com/flags/${flagSrc}']`).should('be.visible')

      cy.intercept('POST', 'https://api.eu.amplitude.com/2/httpapi').as('amplitudeApi');
      // Wait for the API call and assert the payload
      cy.wait('@amplitudeApi').then(interception => {
        expect(interception.response.statusCode).to.equal(200); // assert the response is ok
        const eventProperties = interception.request.body.events[0].event_properties;
        expect(eventProperties.country).to.equal(`${countryAbbr}`); // Assert the country
        expect(eventProperties.postion).to.equal(`${role}`);  // Assert the role
      });
    });
  });

  it('Should display a validation message for empty input field', () => {
    //make sure the fields are empty
    cy.get("input").first().should('have.attr', 'value').and('equal', ''); 
    cy.get("input").last().should('have.attr', 'value').and('equal', '');
    cy.get('button[type="submit"]').click();
    
    cy.xpath("//p[text()='Role is required']")
    .should('have.css', 'color', 'rgb(227, 0, 4)')
    .and('have.css', 'font-size', '12px' )
    .and('have.css', 'font-weight', '400' )

    cy.xpath("//p[text()='Country is required']")
    .should('have.css', 'color', 'rgb(227, 0, 4)' )
    .and('have.css', 'font-size', '12px' )
    .and('have.css', 'font-weight', '400' )
  });

  it('Clear button test', () => {
    cy.wait(1500);
    cy.get("input[name='role']").click();
    cy.get("li[data-text='Accountant']").click();
    cy.get('input[name="country"]').type('Brazil{downArrow}{enter}');
    cy.get("button[title='Clear']").first().click({ force: true }).then(() => {
      cy.get("input").first().should('have.attr', 'value').and('equal', '');
    });
    cy.get("button[title='Clear']").last().click({ force: true }).then(() => {
      cy.get("input").last().should('have.attr', 'value').and('equal', '');
    });
  });  
});