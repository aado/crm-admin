import { QqeCrmPage } from './app.po';

describe('qqe-crm App', () => {
  let page: QqeCrmPage;

  beforeEach(() => {
    page = new QqeCrmPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
