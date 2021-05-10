import buttonIcon from './svg/button-icon.svg';

/**
 * Class for working with UI:
 *  - rendering base structure
 *  - show/hide preview
 *  - apply tune view
 */
export default class Ui {
  /**
   * @param {object} ui - image tool Ui module
   * @param {object} ui.api - Editor.js API
   * @param {ImageConfig} ui.config - user config
   * @param {Function} ui.onSelectFile - callback for clicks on Select file button
   * @param {boolean} ui.readOnly - read-only mode flag
   */
  constructor({ api, config, onSelectFile, readOnly }) {
    this.api = api;
    this.config = config;
    this.onSelectFile = onSelectFile;
    this.readOnly = readOnly;
    this.nodes = {
      wrapper: make('div', [this.CSS.baseClass, this.CSS.wrapper]),

      fileButton: this.createFileButton(),
      caption: make('div', [this.CSS.input, this.CSS.caption], {
        contentEditable: !this.readOnly,
      }),

      fileLink: make('div', [this.CSS.fileLink], {
        contentEditable: !this.readOnly,
      }),
    };

    /**
     * Create base structure
     *  <wrapper>
     *    <image-container>
     *      <image-preloader />
     *    </image-container>
     *    <caption />
     *    <select-file-button />
     *  </wrapper>
     */
    this.nodes.caption.dataset.placeholder = this.config.captionPlaceholder;
    this.nodes.fileLink.dataset.placeholder = 'FileLink'; //this.config.captionPlaceholder;

    this.nodes.wrapper.appendChild(this.nodes.caption);
    this.nodes.wrapper.appendChild(this.nodes.fileButton);
    this.nodes.wrapper.appendChild(this.nodes.fileLink);
  }

  /**
   * CSS classes
   *
   * @returns {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      button: this.api.styles.button,

      /**
       * Tool's classes
       */

      fileContainer: 'file-tool__file',
      caption: 'file-tool__caption',
      fileLink: 'file-tool__link',
      fileButtonEditing: 'file-tool__button_editing',
      fileButtonReadOnly: 'file-tool__button_read_only',
    };
  }

  /**
   * Renders tool UI
   *
   * @param {FileToolData} toolData - saved tool data
   * @returns {Element}
   */
  render() {
    return this.nodes.wrapper;
  }

  /**
   * Creates upload-file button
   *
   * @returns {Element}
   */
  createFileButton() {
    let cssClasses = this.readOnly
      ? [this.CSS.button, this.CSS.fileButtonReadOnly]
      : [this.CSS.button, this.CSS.fileButtonEditing];

    const button = make('div', cssClasses);

    button.innerHTML =
      this.config.buttonContent ||
      `${buttonIcon} ${this.api.i18n.t('Select a File')}`;

    button.addEventListener('click', () => {
      this.onSelectFile();
    });

    return button;
  }

  /**
   * Hide uploading preloader
   *
   * @returns {void}
   */
  // TODO: reenable for big files
  // hidePreloader() {
  //   this.nodes.imagePreloader.style.backgroundImage = '';
  // }

  /**
   * Shows caption input
   *
   * @param {string} text - caption text
   * @returns {void}
   */
  fillCaption(text) {
    if (this.nodes.caption) {
      this.nodes.caption.innerHTML = text;
    }
  }

  /**
   * Shows the file link text
   *
   * @param {string} text - caption text
   * @param {string} filename - name of attached file
   * @param {string} url - download url for attached file
   * @returns {void}
   */
  fillFileLink(text, filename, url) {
    if (this.nodes.fileLink) {
      this.nodes.fileLink.innerHTML = `${text} <a href="${url}" target="_blank">${filename}</a>`;
    }
  }

  /**
   * Shows button text
   *
   * @param {string} filename - name of attached file
   * @returns {void}
   */
  fillButton(filename) {
    if (this.nodes.fileButton) {
      this.nodes.fileButton.innerHTML = filename
        ? `<b>${filename}</b> (click to select a new file)`
        : 'Select a File';
    }
  }
}

/**
 * Helper for making Elements with attributes
 *
 * @param  {string} tagName           - new Element tag name
 * @param  {Array|string} classNames  - list or name of CSS class
 * @param  {object} attributes        - any attributes
 * @returns {Element}
 */
export const make = function make(tagName, classNames = null, attributes = {}) {
  const el = document.createElement(tagName);

  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else if (classNames) {
    el.classList.add(classNames);
  }

  for (const attrName in attributes) {
    el[attrName] = attributes[attrName];
  }

  return el;
};
