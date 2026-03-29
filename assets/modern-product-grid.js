if (!customElements.get('modern-product-grid')) {
  customElements.define(
    'modern-product-grid',
    class ModernProductGrid extends HTMLElement {
      connectedCallback() {
        this.grid = this.querySelector('.modern-product-grid__grid');
        this.loadMoreButton = this.querySelector('.modern-product-grid__load-more-button');
        this.isLoading = false;

        this.setupHoverListeners();
        this.setupLoadMore();
      }

      disconnectedCallback() {
        this.cleanupHoverListeners();
        this.cleanupLoadMore();
      }

      /* ----------------------------------------------------------------
         Hover Reveal
         ---------------------------------------------------------------- */

      setupHoverListeners() {
        if (!window.matchMedia('(hover: hover)').matches) return;

        this.boundHandleMouseEnter = this.handleMouseEnter.bind(this);
        this.boundHandleMouseLeave = this.handleMouseLeave.bind(this);

        this.grid.addEventListener('mouseenter', this.boundHandleMouseEnter, true);
        this.grid.addEventListener('mouseleave', this.boundHandleMouseLeave, true);
      }

      cleanupHoverListeners() {
        if (this.boundHandleMouseEnter) {
          this.grid.removeEventListener('mouseenter', this.boundHandleMouseEnter, true);
        }
        if (this.boundHandleMouseLeave) {
          this.grid.removeEventListener('mouseleave', this.boundHandleMouseLeave, true);
        }
      }

      handleMouseEnter(event) {
        const card = event.target.closest('.modern-product-grid__card');
        if (!card || card.dataset.hasReveal !== 'true') return;
        card.classList.add('is-revealing');
      }

      handleMouseLeave(event) {
        const card = event.target.closest('.modern-product-grid__card');
        if (!card) return;
        card.classList.remove('is-revealing');
      }

      /* ----------------------------------------------------------------
         Load More
         ---------------------------------------------------------------- */

      setupLoadMore() {
        if (!this.loadMoreButton) return;
        this.boundHandleLoadMore = this.handleLoadMore.bind(this);
        this.loadMoreButton.addEventListener('click', this.boundHandleLoadMore);
      }

      cleanupLoadMore() {
        if (this.loadMoreButton && this.boundHandleLoadMore) {
          this.loadMoreButton.removeEventListener('click', this.boundHandleLoadMore);
        }
      }

      async handleLoadMore(event) {
        event.preventDefault();
        if (this.isLoading) return;

        const nextUrl = this.dataset.nextUrl;
        if (!nextUrl) return;

        this.isLoading = true;
        this.loadMoreButton.setAttribute('aria-busy', 'true');
        this.loadMoreButton.textContent = 'Loading...';

        try {
          const sectionId = this.dataset.sectionId;
          const separator = nextUrl.includes('?') ? '&' : '?';
          const fetchUrl = `${nextUrl}${separator}section_id=${sectionId}`;

          const response = await fetch(fetchUrl);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          const newGrid = doc.querySelector('.modern-product-grid__grid');
          if (newGrid) {
            const newCards = newGrid.querySelectorAll('.modern-product-grid__card');
            newCards.forEach((card) => this.grid.appendChild(card));
          }

          const newComponent = doc.querySelector('modern-product-grid');
          if (newComponent && newComponent.dataset.nextUrl) {
            this.dataset.nextUrl = newComponent.dataset.nextUrl;
            this.loadMoreButton.textContent = 'Load more';
            this.loadMoreButton.setAttribute('aria-busy', 'false');
          } else {
            this.removeLoadMoreButton();
          }
        } catch (error) {
          console.error('Modern Product Grid: Failed to load more products', error);
          this.loadMoreButton.textContent = 'Load more';
          this.loadMoreButton.setAttribute('aria-busy', 'false');
        } finally {
          this.isLoading = false;
        }
      }

      removeLoadMoreButton() {
        const wrapper = this.querySelector('.modern-product-grid__load-more-wrapper');
        if (wrapper) wrapper.remove();
        this.loadMoreButton = null;
      }
    }
  );
}
