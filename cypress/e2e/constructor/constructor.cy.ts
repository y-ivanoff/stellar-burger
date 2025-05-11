import { URL } from '@api';
import { deleteCookie, setCookie } from '../../../src/utils/cookie';


describe('Burger Constructor Test', () => {
  beforeEach(() => {
    setCookie('accessToken', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjBhMjMwYzJmMzBjMDAxY2IyMmVjMyIsImlhdCI6MTc0Njk4Nzk4OSwiZXhwIjoxNzQ2OTg5MTg5fQ.2SdD24vaDy3xVkzUI9MU7Ap_CC9V-bgcmnggjeMV8ug');
    localStorage.setItem('refreshToken', '52950115beee9f6ec6f6b417f6439a2be3d987434845bdf85f06909aad284daff665e2e8b536b873');
    cy.intercept('GET', `${URL}//auth/user`, {fixture: 'user.json'}).as('getUser');
    cy.intercept('GET', `${URL}/ingredients`, {fixture: 'ingredients.json'}).as('getIngredients');
    cy.visit('http://localhost:4000');
    cy.wait('@getUser');
  });
  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
  it('Test of getting the list of ingredients from the server', () => {
    cy.get('[data-cy="constructor"]').as('constructor');

    cy.addIngredient('Булки');
    cy.addIngredient('Начинки');

    cy.get('@constructor').should('contain', 'Краторная булка N-200i');
    cy.get('@constructor').should('contain', 'Биокотлета из марсианской Магнолии');
  });
  it('Ingredient Modal Window Opening and Closing Test', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal"]').as('modal');
    cy.get('@modal').should('exist');
    cy.get('@modal').should('contain', 'Краторная булка N-200i');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('@modal').should('not.exist');

    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('@modal').should('exist');

    cy.get('[data-cy="modal-overlay"]').click('left', {force: true});
    cy.get('@modal').should('not.exist');
  });
  it('Order creation Test', () => {
    cy.intercept('POST', `${URL}/orders`, {fixture: 'order.json'}).as('orderBurgerApi');
    cy.get('[data-cy="constructor"]').as('constructor');


    cy.addIngredient('Булки');
    cy.addIngredient('Начинки');

    cy.get('@constructor').children('div').children('button').click();


    cy.get('@constructor').should('not.contain', 'Биокотлета из марсианской Магнолии');
    cy.get('@constructor').should('not.contain', 'Краторная булка N-200i');

    cy.wait('@orderBurgerApi');

  })
});