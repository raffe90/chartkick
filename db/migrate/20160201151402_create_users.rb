class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.date :date_of_birth
      t.string :name
      t.string :gender
      t.boolean :diabetes
      t.boolean :heart_disease

      t.timestamps null: false
    end
  end
end