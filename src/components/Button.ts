export type ButtonTheme = 'primary' | 'secondary' | 'tertiary'

export class Button {
  public static create(theme: ButtonTheme, content: string, onClick: () => void, disabled = false): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = theme;
    button.disabled = disabled;
    button.innerHTML = content;
    button.addEventListener('click', onClick);
    return button;
  }
}
