# shared-ui/component-package Specification

## ADDED Requirements

### Requirement: A block's words are one typed group

A shared UI component SHALL take every word it renders in a single `copy`
prop, and SHALL export the type of that prop under the component's own name.
A value that changes with what is being shown — a price, a count, a remaining
time — SHALL be its own prop rather than part of that group, and so SHALL
every slot the consumer fills with markup, every piece of state, and every
callback.

A word SHALL be typed as a string. A prop MAY be typed as a node only where
the consumer composes markup into it, and such a prop SHALL be a slot rather
than a word: something the component places, not something it says.

A component's copy type SHALL be composable — a surface assembled from
several components SHALL be able to declare its own copy as theirs together,
rather than restating the words each of them already declares.

#### Scenario: A consumer reads what a block needs

- **WHEN** an engineer opens a shared component's exported copy type
- **THEN** it lists every word that component renders, and nothing else

#### Scenario: A word can be an accessible name

- **GIVEN** a component that renders a control labelled by one of its words
- **WHEN** that control needs an accessible name, a title, or a truncation
- **THEN** the word itself serves, without a second prop carrying the same text

#### Scenario: A slot takes markup, a word does not

- **WHEN** a consumer passes an element where a component expects a word
- **THEN** it is a type error
- **AND** the slots the component does offer accept that element

#### Scenario: A surface declares its words once

- **GIVEN** a surface that renders several shared components
- **WHEN** it declares the copy it needs
- **THEN** it composes their copy types rather than repeating their words
