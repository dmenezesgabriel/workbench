{% if activeFilters|length > 0 %}
WHERE
{% for filter in activeFilters %}
  {{ filter.field }} IN ({% for value in filter.values %}'{{ value }}'{% if not loop.last %},{% endif %}{% endfor %})
  {% if not loop.last %}
    AND
  {% endif %}
{% endfor %}
{% endif %}
