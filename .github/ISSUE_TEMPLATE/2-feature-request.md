---
name: 🛠️ Feature Request
description: Sugira uma ideia que nos ajude a melhorar
title: "[Feature]: "
labels:
  - "feature_request"

body:
  - type: markdown
    attributes:
      value: |
        **Thanks :heart: for taking the time to fill out this feature request report!**
        We kindly ask that you search to see if an issue [already exists](https://github.com/wandb/wandb/issues?q=is%3Aissue+sort%3Acreated-desc+) for your feature.

        We are also happy to accept contributions from our users. For more details see [here](https://github.com/wandb/wandb/blob/master/CONTRIBUTING.md).

  - type: textarea
    attributes:
      label: Descrição
      description: |
        Uma descrição concisa no qual tenhas interesse.
    validations:
      required: true

  - type: textarea
    attributes:
      label: Suggested Solution
      description: |
        Descreva a solução que gostaria. Seja claro e conciso 
        em sua descrição.
    validations:
      required: true

  - type: textarea
    attributes:
      label: Alternativas
      description: |
        Descrea alguma alternativa que tenhas considerado.
    validations:
      required: false

  - type: textarea
    attributes:
      label: Contexto Adicional
      description: |
        Adicione qualquer contexto sobre o problema.
    validations:
      required: false