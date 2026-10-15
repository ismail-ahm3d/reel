# people

A person's page: portrait, biography, known-for rail and a filterable list of credits.
Status: done.

## Shape
- Layers: domain, data, presentation
- Screens: PersonScreen (`person/[id].tsx`)
- Use cases: getPerson, returned by `makePeople`
- Error family: none

## Gotchas
- "Known for" ranks credits in the person's own department by vote count; talk-show guest spots with few episodes are excluded.
- Credits are filtered per department (Acting or a crew department) and per kind; the department the person is known for is preselected.
