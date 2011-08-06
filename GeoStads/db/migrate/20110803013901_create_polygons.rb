class CreatePolygons < ActiveRecord::Migration
  def self.up
    create_table :polygons, :options=>"ENGINE=MyISAM", :force => true do |t|
      t.string :name
      t.string :data_base
      t.string :html_color
      t.polygon :polygon

      t.timestamps
    end
  end

  def self.down
    drop_table :polygons
  end
end
