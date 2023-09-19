BEGIN;
SELECT plan(1);

-- Examples: https://pgtap.org/documentation.html

SELECT ok( 9 ^ 2 = 81,    'simple exponential' );
ROLLBACK;
