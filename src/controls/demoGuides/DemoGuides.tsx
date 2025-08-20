import styles from "./DemoGuides.module.scss";
import * as React from "react";
import { DemoGuidesData } from "./DemoGuidesData";

import youtubeIcon from "../../../images/icons/youtube.svg";
import githubIcon from "../../../images/icons/github-mark.svg";
import f5Icon from "../../../images/icons/f5.svg";
import documentationIcon from "../../../images/icons/documentation.svg";
import linkIcon from "../../../images/icons/link.svg";

// Declare vscode global
declare const vscode: any;

interface State {
  search: string;
  selectedModules: string[];
  selectedTags: string[];
  filteredGuides?: any[];
}

export default class DemoGuides extends React.Component<{}, State> {
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
      const moduleMenu = this.moduleDropdown.querySelector(`.${styles.demoGuidesDropdownMenu}`) as HTMLElement;
      if (moduleMenu) {
        moduleMenu.classList.remove(styles.demoGuidesOpen);
      }
    }
    
    // Close tags dropdown if click is outside
    if (this.tagsDropdown && !this.tagsDropdown.contains(target)) {
      const tagsMenu = this.tagsDropdown.querySelector(`.${styles.demoGuidesDropdownMenu}`) as HTMLElement;
      if (tagsMenu) {
        tagsMenu.classList.remove(styles.demoGuidesOpen);
      }
    }
  };

  handleChange = (key: keyof State, value: string) => {
    this.setState(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  handleCardClick = (sample: any) => {
    if (sample.url) {
      console.log('Opening URL:', sample.url);
      
      if (typeof vscode !== 'undefined') {
        vscode.postMessage({
          command: 'openExternalLink',
          data: sample.url,
        });
      } else {
        // Fallback for development/testing
        window.open(sample.url, '_blank');
      }
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
    
    const menu = container.querySelector(`.${styles.demoGuidesDropdownMenu}`) as HTMLElement;
    if (menu) {
      menu.classList.toggle(styles.demoGuidesOpen);
    }
  };

  // Add this helper method to highlight search terms
  highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className={styles.demoGuidesHighlight}>{part}</mark>
      ) : part
    );
  };

  handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const placeholder = img.nextElementSibling as HTMLElement;
    
    if (placeholder && placeholder.classList.contains(styles.demoGuidesCardPlaceholder)) {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
    }
  };

  // Helper function to get content type label information
  getContentTypeInfo = (contentType?: string[]) => {
    if (!contentType || contentType.length === 0) return null;
    
    const type = contentType[0];
    
    if (type === 'Youtube Video') {
      return { icon: youtubeIcon, label: 'Video' };
    }
    if (type === 'GitHub Guide' || type === 'GitHub' || type === 'GitHub Repository') {
      return { icon: githubIcon, label: 'GitHub' };
    }
    if (type === 'Documentation') {
      return { icon: documentationIcon, label: 'Documentation' };
    }
    if (type === 'Devcentral Article') {
      return { icon: f5Icon, label: 'F5 Devcentral' };
    }
    // Fallback generic external resource
    return { icon: linkIcon, label: 'Link' };
  };

  public render() {
    const { search, selectedModules, selectedTags } = this.state;

    // Extract unique contentType values from the sample data
    const availableContentTypes = [...new Set(
      DemoGuidesData
        .filter(sample => sample.contentType && sample.contentType.length > 0)
        .flatMap(sample => sample.contentType)
        .filter((type): type is string => type !== undefined && type !== '')
    )].sort();

    // Extract unique tag values from the guide data
    const availableTags = [...new Set(
      DemoGuidesData
        .filter(sample => sample.tags && sample.tags.length > 0)
        .flatMap(sample => sample.tags)
        .filter((tag): tag is string => tag !== undefined)
    )].sort();

    const filtered = DemoGuidesData.filter(sample => {
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

    const featuredDemoGuides = filtered.filter(sample => sample.isFeatured);
    const nonFeaturedDemoGuides = filtered.filter(sample => !sample.isFeatured);

    return (
      <div className={styles.demoGuidesContainer}>
        <h1>🗂️ Demo Guides</h1>
        <p>
          Step-by-step guides and hands-on tutorials explain how to get started and build advanced BIG-IP automation workflows with The F5 Extension. Video walkthroughs and demos are also available on YouTube for visual learning.
        </p>

        <div className={styles.demoGuidesFilters}>
          <input
            className={styles.demoGuidesSearchInput}
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => this.handleChange('search', e.target.value)}
          />

          {/* Configuration Type Dropdown */}
          <div className={styles.demoGuidesDropdownWrapper} ref={el => (this.moduleDropdown = el)}>
            <div
              className={styles.demoGuidesDropdownHeader}
              onClick={() => this.toggleDropdown(this.moduleDropdown)}
            >
              <span>
                {selectedModules.length > 0 
                  ? selectedModules.join(', ') 
                  : 'Type'}
              </span>
              <span>▼</span>
            </div>
            <div className={`${styles.demoGuidesDropdownMenu}`}>
              {availableContentTypes.map(mod => (
                <label key={mod} className={styles.demoGuidesCheckboxOption}>
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
          <div className={styles.demoGuidesDropdownWrapper} ref={el => (this.tagsDropdown = el)}>
            <div
              className={styles.demoGuidesDropdownHeader}
              onClick={() => this.toggleDropdown(this.tagsDropdown)}
            >
              <span>
                {selectedTags.length > 0 
                  ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`
                  : 'Tags'}
              </span>
              <span>▼</span>
            </div>
            <div className={`${styles.demoGuidesDropdownMenu}`}>
              <div className={styles.demoGuidesTagsGrid}>
                {availableTags.map(tag => (
                  <label key={tag} className={styles.demoGuidesCheckboxOption}>
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

        {/* Featured guides */}
        {featuredDemoGuides.length > 0 && (
          <div className={`${styles.demoGuidesSection} ${styles.demoGuidesFeatured}`}>
            <h3>⭐ Featured guides</h3>
            <div className={styles.demoGuidesGrid}>
              {featuredDemoGuides.map((sample, idx) => (
                <div 
                  key={idx} 
                  className={styles.demoGuidesCard}
                  onClick={() => this.handleCardClick(sample)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      this.handleCardClick(sample);
                    }
                  }}
                >
                  <div className={styles.demoGuidesCardImage}>
                    {(sample.image || sample.icon) && (
                      <img 
                        src={sample.image || sample.icon} 
                        alt={sample.title}
                        className={sample.icon ? styles.demoGuidesCardIcon : ''}
                        onError={(e) => {
                          this.handleImageError(e);
                        }}
                        onLoad={(e) => {
                          // Hide placeholder when image loads successfully
                          const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                          if (placeholder && placeholder.classList.contains(styles.demoGuidesCardPlaceholder)) {
                            placeholder.style.display = 'none';
                          }
                        }}
                      />
                    )}
                    <div className={styles.demoGuidesCardPlaceholder} style={{ display: 'flex' }}>
                      <span>📄</span>
                    </div>
                    {this.getContentTypeInfo(sample.contentType) && (
                      <div className={styles.demoGuidesContentTypeLabel}>
                        <img 
                          src={this.getContentTypeInfo(sample.contentType)!.icon} 
                          alt={this.getContentTypeInfo(sample.contentType)!.label}
                          className={styles.demoGuidesContentTypeIcon}
                        />
                        <div className={styles.demoGuidesContentTypeInfo}>
                          <span className={styles.demoGuidesContentTypeTitle}>
                            {this.getContentTypeInfo(sample.contentType)!.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.demoGuidesCardContent}>
                    <h4 className={styles.demoGuidesCardTitle}>
                      {this.highlightText(sample.title, search)}
                    </h4>
                    <div className={styles.demoGuidesTags}>
                      {sample.tags.map(tag => (
                        <span key={tag} className={styles.demoGuidesTag}>{tag}</span>
                      ))}
                    </div>
                    <p className={styles.demoGuidesDescription}>
                      {this.highlightText(sample.description, search)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All other guides */}
        {nonFeaturedDemoGuides.length > 0 && (
          <div className={styles.demoGuidesSection}>
            <div className={styles.demoGuidesGrid}>
              {nonFeaturedDemoGuides.map((sample, idx) => (
                <div 
                  key={idx} 
                  className={styles.demoGuidesCard}
                  onClick={() => this.handleCardClick(sample)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      this.handleCardClick(sample);
                    }
                  }}
                >
                  <div className={styles.demoGuidesCardImage}>
                    {(sample.image || sample.icon) && (
                      <img 
                        src={sample.image || sample.icon} 
                        alt={sample.title}
                        className={sample.icon ? styles.demoGuidesCardIcon : ''}
                        onError={(e) => {
                          this.handleImageError(e);
                        }}
                        onLoad={(e) => {
                          // Hide placeholder when image loads successfully
                          const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                          if (placeholder && placeholder.classList.contains(styles.demoGuidesCardPlaceholder)) {
                            placeholder.style.display = 'none';
                          }
                        }}
                      />
                    )}
                    <div className={styles.demoGuidesCardPlaceholder} style={{ display: 'flex' }}>
                      <span>📄</span>
                    </div>
                    {this.getContentTypeInfo(sample.contentType) && (
                      <div className={styles.demoGuidesContentTypeLabel}>
                        <img 
                          src={this.getContentTypeInfo(sample.contentType)!.icon} 
                          alt={this.getContentTypeInfo(sample.contentType)!.label}
                          className={styles.demoGuidesContentTypeIcon}
                        />
                        <div className={styles.demoGuidesContentTypeInfo}>
                          <span className={styles.demoGuidesContentTypeTitle}>
                            {this.getContentTypeInfo(sample.contentType)!.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.demoGuidesCardContent}>
                    <h4 className={styles.demoGuidesCardTitle}>
                      {this.highlightText(sample.title, search)}
                    </h4>
                    <div className={styles.demoGuidesTags}>
                      {sample.tags.map(tag => (
                        <span key={tag} className={styles.demoGuidesTag}>{tag}</span>
                      ))}
                    </div>
                    <p className={styles.demoGuidesDescription}>
                      {this.highlightText(sample.description, search)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className={styles.demoGuidesNoResults}>
            <p>No guides found matching your criteria.</p>
          </div>
        )}
      </div>
    );
  }
}