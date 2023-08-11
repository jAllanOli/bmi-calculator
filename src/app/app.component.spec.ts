import { AppComponent } from './app.component';
import { render, screen } from '@testing-library/angular';

describe('Main component', () => {
  it('should render the component', async () => {
    await render(AppComponent);
    expect(screen.queryByRole('main')).toBeTruthy();
  });
});
