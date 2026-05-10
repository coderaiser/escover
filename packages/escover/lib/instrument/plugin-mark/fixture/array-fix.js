(__c4['🧨'](1, 0), [
    'git log {{ version }}..HEAD --pretty=format:"- %h %s"',
    '--grep "{{ category }}("',
    '--grep "{{ category }}: "',
    '|',
    'sed "s/{{ category }}(/(/g"',
    '|',
    'sed "s/{{ category }}: //g"',
].join(' '));
