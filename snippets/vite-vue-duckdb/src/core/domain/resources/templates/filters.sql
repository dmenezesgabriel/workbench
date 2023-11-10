{% for filter in activeFilters %}
  {{ filter.field }} IN ({% for value in filter.values %}'{{ value }}'{% if not loop.last %},{% endif %}{% endfor %})
  {% if not loop.last %}
    AND
  {% endif %}
{% endfor %}