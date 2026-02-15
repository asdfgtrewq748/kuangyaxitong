/**
 * Mining Pressure Assessment - Interactive Components
 *
 * Reusable components with enhanced interactions
 */

// Base Button Component
const BaseButton = {
  template: `
    <button
      class="btn btn--{{ variant }}"
      {{#if disabled }}disabled{{/if}}"
      {{#if icon }}btn--icon{{/if}}"
      {{#if block }}btn--block{{/if}}"
      {{#if loading }}btn--loading{{/if}}"
      type="{{ type }}"
    >
      {{#if icon}}
        <span class="btn__icon">{{{icon}}}</span>
      {{/if}}
      {{#if loading}}
        <span class="btn__loader"></span>
      {{/if}}
      <span class="btn__content">{{{content}}</span>
      {{#if chevron}}
        <span class="btn__chevron">▼</span>
      {{/if}}
    </button>
  `,

  variants: ['primary', 'secondary', 'ghost', 'icon', 'block'],

  render(data) {
    data = data || {}
    data.variant = data.variant || 'primary'
    data.type = data.type || 'button'
    data.disabled = Boolean(data.disabled)
    data.loading = Boolean(data.loading)
    data.icon = data.icon || null
    data.block = Boolean(data.block)
    data.chevron = data.chevron || null
    data.content = data.content || 'Button'

    return this.template(data)
  }
}

// Base Input Component
const BaseInput = {
  template: `
    <div class="input-group">
      {{#if label}}
        <label class="input__label">{{{label}}</label>
      {{/if}}
      <div class="input__wrapper">
        {{#if icon}}
          <span class="input__icon">{{{icon}}</span>
        {{/if}}
        <input
          class="input__field"
          type="{{ type }}"
          name="{{ name }}"
          placeholder="{{{placeholder}}}"
          {{#if value}}value="{{{value}}}"{{/if}}
          {{#if disabled}}disabled{{/if}}"
          {{#if readonly}}readonly{{/if}}"
          {{#if required}}required{{/if}}"
          {{#if min}}min="{{{min}}}"{{/if}}"
          {{#if max}}max="{{{max}}}"{{/if}}"
          {{#if step}}step="{{{step}}}"{{/if}}
        />
        {{#if error}}
          <span class="input__error">{{{error}}</span>
        {{/if}}
        {{#if suffix}}
          <span class="input__suffix">{{{suffix}}</span>
        {{/if}}
      </div>
      {{#if hint}}
        <span class="input__hint">{{{hint}}</span>
      {{/if}}
    </div>
  `,

  render(data) {
    data = data || {}
    data.type = data.type || 'text'
    data.name = data.name || ''
    data.label = data.label || null
    data.placeholder = data.placeholder || ''
    data.value = data.value || ''
    data.disabled = Boolean(data.disabled)
    data.readonly = Boolean(data.readonly)
    data.required = Boolean(data.required)
    data.min = data.min || null
    data.max = data.max || null
    data.step = data.step || null
    data.icon = data.icon || null
    data.error = data.error || null
    data.hint = data.hint || null
    data.suffix = data.suffix || null

    return this.template(data)
  }
}

// Base Card Component
const BaseCard = {
  template: `
    <div class="card {{#if hoverable}}card--hoverable{{/if}} {{#if clickable}}card--clickable{{/if}}">
      {{#if header}}
        <div class="card__header">
          {{#if title}}
            <h3 class="card__title">{{{title}}</h3>
          {{/if}}
          {{#if subtitle}}
            <p class="card__subtitle">{{{subtitle}}</p>
          {{/if}}
          {{#if actions}}
            <div class="card__actions">{{{actions}}</div>
          {{/if}}
        </div>
      {{/if}}
      {{#if body}}
        <div class="card__body">{{{body}}</div>
      {{/if}}
      {{#if footer}}
        <div class="card__footer">{{{footer}}</div>
      {{/if}}
    </div>
  `,

  render(data) {
    data = data || {}
    data.hoverable = Boolean(data.hoverable)
    data.clickable = Boolean(data.clickable)
    data.title = data.title || null
    data.subtitle = data.subtitle || null
    data.body = data.body || ''
    data.footer = data.footer || null
    data.actions = data.actions || null

    return this.template(data)
  }
}

// Status Badge Component
const StatusBadge = {
  template: `
    <span class="status-badge status-badge--{{status}} {{#if dot}}status-badge--dot{{/if}}">
      {{#if icon}}<span class="status-badge__icon">{{{icon}}</span>{{/if}}
      <span class="status-badge__label">{{{label}}</span>
    </span>
  `,

  statuses: {
    success: { color: '#22c55e', icon: '✓', label: 'Success' },
    warning: { color: '#f59e0b', icon: '⚠', label: 'Warning' },
    error: { color: '#ef4444', icon: '✕', label: 'Error' },
    info: { color: '#3b82f6', icon: 'ⓘ', label: 'Info' },
    processing: { color: '#0f766e', icon: '⋯', label: 'Processing' },
  },

  render(data) {
    data = data || {}
    data.status = data.status || 'info'
    data.label = data.label || ''
    data.dot = Boolean(data.dot)
    data.icon = data.icon || null

    const config = this.statuses[data.status] || this.statuses.info

    return this.template({
      ...data,
      status: data.status,
      color: config.color,
      icon: data.icon || config.icon,
      label: data.label,
    })
  }
}

// Loading Spinner Component
const LoadingSpinner = {
  template: `
    <div class="spinner spinner--{{size}}">
      <div class="spinner__dots">
        <span class="spinner__dot"></span>
        <span class="spinner__dot"></span>
        <span class="spinner__dot"></span>
      </div>
    {{#if text}}
        <span class="spinner__text">{{{text}}</span>
      {{/if}}
    </div>
  `,

  sizes: ['sm', 'md', 'lg'],

  render(data) {
    data = data || {}
    data.size = data.size || 'md'
    data.text = data.text || null

    return this.template(data)
  }
}

// Empty State Component
const EmptyState = {
  template: `
    <div class="empty-state">
      {{#if illustration}}
        <div class="empty-state__illustration">{{{illustration}}</div>
      {{/if}}
      {{#if icon}}
        <div class="empty-state__icon">{{{icon}}</div>
      {{/if}}
      <div class="empty-state__content">
        <h3 class="empty-state__title">{{{title}}</h3>
        {{#if description}}
          <p class="empty-state__description">{{{description}}</p>
        {{/if}}
        {{#if action}}
          <button class="btn btn--primary" onclick="{{{action}}">{{{actionLabel}}</button>
        {{/if}}
      </div>
    </div>
  `,

  illustrations: {
    noData: `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M20 8v6M2 12h4l4 4-4-4 4h-4m0 0H6v6a2 2 0 012a2 2 0 012zm-2 2a2 2 0 012 6v6a2 2 0 012-2 0 012z" opacity="0.3"/>
      </svg>
    `,
    noResults: `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-9-1.4142 0-9-1.4142 0-9"/>
      </svg>
    `,
  },

  render(data) {
    data = data || {}
    data.title = data.title || 'No Data'
    data.description = data.description || ''
    data.action = data.action || null
    data.actionLabel = data.actionLabel || 'Load Data'
    data.icon = data.icon || this.illustrations.noData
    data.illustration = data.illustration || null

    return this.template(data)
  }
}

// Tooltip Component
const Tooltip = {
  template: `
    <div class="tooltip tooltip--{{position}}" data-tooltip="{{{content}}">
      {{content}}
    </div>
  `,

  positions: ['top', 'bottom', 'left', 'right'],

  render(data) {
    data = data || {}
    data.position = data.position || 'top'
    data.content = data.content || ''

    return this.template(data)
  }
}

// Export components
if (typeof module !== 'undefined') {
  module.exports = {
    BaseButton,
    BaseInput,
    BaseCard,
    StatusBadge,
    LoadingSpinner,
    EmptyState,
    Tooltip,
  }
}
