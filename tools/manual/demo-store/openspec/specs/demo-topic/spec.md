# demo-topic Specification

## Purpose
A cross-cutting topic: a directory holding `spec.md` directly, so the reader
files it under topics rather than products.

## Requirements
### Requirement: Every surface reads the topic the same way

Every surface SHALL read the topic through one module.

#### Scenario: demo-topic-SC-01 - One module answers

- **WHEN** a surface reads the topic
- **THEN** it goes through the one module
