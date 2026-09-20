export type ButtonTheme = 'primary' | 'secondary' | 'tertiary';

export class Button {
  public static create(
    theme: ButtonTheme,
    label: string,
    onClick: () => void,
    disabled = false,
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = theme;
    button.type = 'button';
    button.disabled = disabled;
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }
}
