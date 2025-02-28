import SalaryInsightsPage from '../../support/pages/salaryInsightsPage.js';
import roleAndCountry from '../../fixtures/roleAndCountry.json';

const salaryInsightsPage = new SalaryInsightsPage();

describe('Salary Insights', () => {
  beforeEach(() => {
    salaryInsightsPage.visit();
    cy.fixture('roleAndCountry').as('roleAndCountry');
  });

  roleAndCountry.roles.forEach(({ role, country, countryAbbr, flagSrc }) => {
    it(`Should display salary insights for ${role} in ${country}`, () => {
      cy.wait(2500);
      salaryInsightsPage.selectRole(role);
      salaryInsightsPage.selectCountry(country);
      salaryInsightsPage.submitForm();

      salaryInsightsPage.verifyResults(country, role);
      salaryInsightsPage.verifyFlag(flagSrc);

      salaryInsightsPage.interceptApiCall();
      salaryInsightsPage.verifyApiCall(countryAbbr, role);
    });
  });

  it('Should display a validation message for empty input field', () => {
    cy.get("input").first().should('have.value', '');
    cy.get("input").last().should('have.value', '');
    salaryInsightsPage.submitForm();

    const errorMsg = ['Role', 'Country'];
    salaryInsightsPage.verifyValidationMessages(errorMsg);
  });

  it('Clear button test', () => {
    cy.wait(2500);
    cy.get('@roleAndCountry').then((fixtureData) => {
      const firstRole = fixtureData.roles[0];
      salaryInsightsPage.selectRole(firstRole.role);
      salaryInsightsPage.selectCountry(firstRole.country);
      salaryInsightsPage.clearInputs();
      cy.get("input[name='role']").should('have.value', '');
      cy.get("input[name='country']").should('have.value', '');
    });
  });
});

export default salaryInsightsPage;