-- Une seule offre StoryKid à 3,99 €. Les anciennes histoires restent lisibles.
update public.stories
set format = 'standard'
where format in ('short', 'complete');

update public.purchases
set offer_id = 'standard'
where offer_id in ('short', 'complete');
