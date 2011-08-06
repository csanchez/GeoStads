# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)
InegiEntitie.create([
{
:cve_ent => 9,
:nom_ent =>"Distrito Federal" ,
:cve_mun => 4,
:nom_mun =>"Cuajimalpa de Morelos" ,
:cve_loc => 10 ,
:nom_loc =>"Cruz Blanca" ,
:point => 'POINT(-99.0 19.0)',
:pob_total => 630 ,
:pob_m => 311,
:pob_f => 319,
:gmaps => true
},
{
:cve_ent => 9,
:nom_ent =>"Distrito Federal" ,
:cve_mun => 4,
:nom_mun =>"Cuajimalpa de Morelos" ,
:cve_loc => 11 ,
:nom_loc =>"DUMMY LOC" ,
:point => 'POINT(-99.20 19.25)',
:pob_total => 700 ,
:pob_m => 311,
:pob_f => 319,
:gmaps => true
},
])
