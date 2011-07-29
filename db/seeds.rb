# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)
InegiEntitie.create([
{
:entidad => 9,
:nom_ent =>"Distrito Federal" ,
:mun => 4,
:nom_mun =>"Cuajimalpa de Morelos" ,
:loc => 10 ,
:nom_loc =>"Cruz Blanca" ,
:lat_lon => 'POINT(-99.0 19.0)',
:pob_total => 630 ,
:pob_mas => 311,
:pob_fem => 319,
:gmaps => true
},
])
