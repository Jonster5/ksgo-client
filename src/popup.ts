interface PopupOptions {
    title: string;
    text: string;
    target: HTMLElement;
    buttons: Array<{
        text: string;
        thumb: string;
        value: string;
    }>;
}

export function Popup(options: PopupOptions): Promise<string> {
    return new Promise((resolve, reject) => {
        const { title, text, target, buttons } = options;

        const wrapper = document.createElement('div');

        wrapper.innerHTML = `
        <div>${title}</div>
        <p>${text}</p>
        <div>
        `;

        buttons.forEach((button) => {});

        wrapper.innerHTML += '</div>';
    });
}
