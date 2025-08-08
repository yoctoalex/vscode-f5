import styles from "./SampleGallery.module.scss";
import * as React from "react";
import { SampleGalleryData } from "./SampleGalleryData";

// Declare vscode global
declare const vscode: any;

interface State {
  search: string;
  selectedModules: string[];
  selectedTags: string[];
  filteredSamples?: any[];
}

export default class SampleGallery extends React.Component<{}, State> {
  private moduleDropdown: HTMLDivElement | null = null;
  private tagsDropdown: HTMLDivElement | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      search: '',
      selectedModules: [],
      selectedTags: [],
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    
    // Close module dropdown if click is outside
    if (this.moduleDropdown && !this.moduleDropdown.contains(target)) {
      const moduleMenu = this.moduleDropdown.querySelector(`.${styles.sampleGalleryDropdownMenu}`) as HTMLElement;
      if (moduleMenu) {
        moduleMenu.classList.remove(styles.sampleGalleryOpen);
      }
    }
    
    // Close tags dropdown if click is outside
    if (this.tagsDropdown && !this.tagsDropdown.contains(target)) {
      const tagsMenu = this.tagsDropdown.querySelector(`.${styles.sampleGalleryDropdownMenu}`) as HTMLElement;
      if (tagsMenu) {
        tagsMenu.classList.remove(styles.sampleGalleryOpen);
      }
    }
  };

  handleChange = (key: keyof State, value: string) => {
    this.setState(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  createSample = (sample: any) => {
    console.log('Creating sample:', sample.title);
    
    if (typeof vscode !== 'undefined') {
      vscode.postMessage({
        command: 'createGithubSample',
        data: sample.downloadUrl,
      });
    }
  };

  applyFilters = () => {
    const getCheckedValues = (container: HTMLElement | null) =>
      container ? Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(
        (el: any) => el.value
      ) : [];

    const selectedModules = getCheckedValues(this.moduleDropdown);
    const selectedTags = getCheckedValues(this.tagsDropdown);

    this.setState({
      selectedModules,
      selectedTags
    });
  };

  toggleDropdown = (container: HTMLElement | null) => {
    if (!container) return;
    
    const menu = container.querySelector(`.${styles.sampleGalleryDropdownMenu}`) as HTMLElement;
    if (menu) {
      menu.classList.toggle(styles.sampleGalleryOpen);
    }
  };

  // Add this helper method to highlight search terms
  highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className={styles.sampleGalleryHighlight}>{part}</mark>
      ) : part
    );
  };

  public render() {
    const { search, selectedModules, selectedTags } = this.state;

    // Extract unique contentType values from the sample data
    const availableContentTypes = [...new Set(
      SampleGalleryData
        .filter(sample => sample.contentType && sample.contentType.length > 0)
        .flatMap(sample => sample.contentType)
        .filter((type): type is string => type !== undefined)
    )].sort();

    // Extract unique tag values from the guide data
    const availableTags = [...new Set(
      SampleGalleryData
        .filter(sample => sample.tags && sample.tags.length > 0)
        .flatMap(sample => sample.tags)
        .filter((tag): tag is string => tag !== undefined)
    )].sort();

    const filtered = SampleGalleryData.filter(sample => {
      const matchesSearch =
        !search || 
        sample.title.toLowerCase().includes(search.toLowerCase()) ||
        sample.description.toLowerCase().includes(search.toLowerCase());

      const matchesModule =
        selectedModules.length === 0 ||
        selectedModules.some(mod => sample.contentType && sample.contentType.includes(mod));

      const matchesTag =
        selectedTags.length === 0 ||
        selectedTags.some(tag => sample.tags.includes(tag));

      return matchesSearch && matchesModule && matchesTag;
    });

    const featuredSamples = filtered.filter(sample => sample.isFeatured);
    const nonFeaturedSamples = filtered.filter(sample => !sample.isFeatured);

    return (
      <div className={styles.sampleGalleryContainer}>
        <h1>🧩 Code Samples</h1>
        <p>
          Explore the sample gallery showcasing solutions for BIG-IP automation using The F5 Extension. Create and edit BIG-IP configurations directly in Visual Studio Code. Each example demonstrates practical use cases to help accelerate development.
        </p>

        <div className={styles.sampleGalleryFilters}>
          <input
            className={styles.sampleGallerySearchInput}
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => this.handleChange('search', e.target.value)}
          />

          {/* Configuration Type Dropdown */}
          <div className={styles.sampleGalleryDropdownWrapper} ref={el => (this.moduleDropdown = el)}>
            <div
              className={styles.sampleGalleryDropdownHeader}
              onClick={() => this.toggleDropdown(this.moduleDropdown)}
            >
              <span>
                {selectedModules.length > 0 
                  ? selectedModules.join(', ') 
                  : 'Type'}
              </span>
              <span>▼</span>
            </div>
            <div className={`${styles.sampleGalleryDropdownMenu}`}>
              {availableContentTypes.map(mod => (
                <label key={mod} className={styles.sampleGalleryCheckboxOption}>
                  <input
                    type="checkbox"
                    value={mod}
                    onChange={this.applyFilters}
                    checked={selectedModules.includes(mod)}
                  />
                  {mod}
                </label>
              ))}
            </div>
          </div>

          {/* Tags Dropdown */}
          <div className={styles.sampleGalleryDropdownWrapper} ref={el => (this.tagsDropdown = el)}>
            <div
              className={styles.sampleGalleryDropdownHeader}
              onClick={() => this.toggleDropdown(this.tagsDropdown)}
            >
              <span>
                {selectedTags.length > 0 
                  ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`
                  : 'Tags'}
              </span>
              <span>▼</span>
            </div>
            <div className={`${styles.sampleGalleryDropdownMenu}`}>
              <div className={styles.sampleGalleryTagsGrid}>
                {availableTags.map(tag => (
                  <label key={tag} className={styles.sampleGalleryCheckboxOption}>
                    <input
                      type="checkbox"
                      value={tag}
                      onChange={this.applyFilters}
                      checked={selectedTags.includes(tag)}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured samples */}
        {featuredSamples.length > 0 && (
          <div className={`${styles.sampleGallerySection} ${styles.sampleGalleryFeatured}`}>
            <h3>⭐ Featured samples</h3>
            {featuredSamples.map((sample, idx) => (
              <div key={idx} className={styles.sampleGallerySampleRow}>
                <div className={styles.sampleGalleryContent}>
                  <div className={styles.sampleGalleryFirstLine}>
                    <strong>{this.highlightText(sample.title, search)}</strong>
                    <div className={styles.sampleGalleryTags}>
                      {sample.tags.map(tag => (
                        <span key={tag} className={styles.sampleGalleryTag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <p className={styles.sampleGalleryDescription}>
                    {this.highlightText(sample.description, search)}
                  </p>
                </div>
                <div className={styles.sampleGalleryActions}>
                  <button onClick={() => this.createSample(sample)}>Create</button>
                  <a href={sample.url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All other samples */}
        {nonFeaturedSamples.length > 0 && (
          <div className={styles.sampleGallerySection}>
            {nonFeaturedSamples.map((sample, idx) => (
              <div key={idx} className={styles.sampleGallerySampleRow}>
                <div className={styles.sampleGalleryContent}>
                  <div className={styles.sampleGalleryFirstLine}>
                    <strong>{this.highlightText(sample.title, search)}</strong>
                    <div className={styles.sampleGalleryTags}>
                      {sample.tags.map(tag => (
                        <span key={tag} className={styles.sampleGalleryTag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <p className={styles.sampleGalleryDescription}>
                    {this.highlightText(sample.description, search)}
                  </p>
                </div>
                <div className={styles.sampleGalleryActions}>
                  <button onClick={() => this.createSample(sample)}>Create</button>
                  <a href={sample.url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className={styles.sampleGalleryNoResults}>
            <p>No samples found matching your criteria.</p>
          </div>
        )}
      </div>
    );
  }
}