class CreateContactRequests < ActiveRecord::Migration[5.2]
  def change
    create_table :contact_requests do |t|
      t.string :name
      t.string :phone
      t.string :email
      t.string :message

      t.timestamps
    end
  end
end
