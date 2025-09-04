---
layout: page
title: Projects
permalink: /projects/
---
<div class="post-list">
{% assign items = site.projects | sort: 'order' %}
{% for item in items %}
{% unless item.url == page.url %}
<a href="{{ item.url | relative_url }}">{{ item.title }}</a>
{% endunless %}
{% endfor %}
</div>
