---
layout: page
title: Projects
permalink: /projects/
---
{% for item in site.projects %}
- <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
{% endfor %}

