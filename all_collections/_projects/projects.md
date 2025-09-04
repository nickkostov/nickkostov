---
layout: page
title: Projects
permalink: /projects/
---
{% assign items = site.projects | sort: 'order' %}
{% for item in items %}
- <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
{% endfor %}