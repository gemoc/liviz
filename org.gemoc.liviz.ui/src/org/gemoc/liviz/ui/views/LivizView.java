/*******************************************************************************
 * Copyright (c) 2016, 2017 Inria and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Inria - initial API and implementation
 *******************************************************************************/
package org.gemoc.liviz.ui.views;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.eclipse.gemoc.executionframework.ui.views.engine.EngineSelectionDependentViewPart;
import org.eclipse.gemoc.trace.commons.model.trace.Dimension;
import org.eclipse.gemoc.trace.commons.model.trace.State;
import org.eclipse.gemoc.trace.commons.model.trace.Step;
import org.eclipse.gemoc.trace.commons.model.trace.TracedObject;
import org.eclipse.gemoc.trace.commons.model.trace.Value;
import org.eclipse.gemoc.trace.gemoc.api.IMultiDimensionalTraceAddon;
import org.eclipse.gemoc.trace.gemoc.api.ITraceExtractor;
import org.eclipse.gemoc.trace.gemoc.api.ITraceListener;
import org.eclipse.gemoc.trace.gemoc.api.ITraceNotifier;
import org.eclipse.gemoc.xdsmlframework.api.core.IExecutionEngine;
import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.TableEditor;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableColumn;
import org.eclipse.swt.widgets.TableItem;
import org.gemoc.liviz.ui.network.WebApi;


public class LivizView extends EngineSelectionDependentViewPart {

	public static final String ID = "org.gemoc.liviz.ui.views.LivizView";

	private IMultiDimensionalTraceAddon<Step<?>, State<?,?>, TracedObject<?>, Dimension<?>, Value<?>> traceAddon;

	private List<String> variables = new ArrayList<String>();
	
	private Table table;
	
	private Button[] variablesInput;
	
	@Override
	public void dispose() 
	{
		super.dispose();
		
	}

	@Override
	public void createPartControl(Composite parent) 
	{
		this.table = new Table(parent, SWT.SINGLE | SWT.FULL_SELECTION | SWT.HIDE_SELECTION);
	    table.setHeaderVisible(true);
	    table.setLinesVisible(true);

	    TableColumn column = new TableColumn(table, SWT.CENTER);
	    column.setText("Variable name");
	    column.pack();

	    
	    Button button = new Button(parent,SWT.PUSH);
	    button.addListener(SWT.Selection, new Listener()
	    {
	        @Override
	        public void handleEvent(Event event)
	        {
	        	StringBuilder builder = new StringBuilder();
	        	
	        	for (Button checkbox : variablesInput)
	        	{
	        		String variableName = checkbox.getText();
	        		
	        		if (checkbox.getSelection())
	        		{
	        			builder.append("\""+variableName+"\"");
	        		}
	        	}
	        		
	        		try 
	        		{
	        			var configuration = "{\"graphs\":[{\"variables\":["+builder.toString()+"],\"window\":\"0\",\"name\":\"myGraph\",\"x\":\"time\",\"type\":\"points\"}]}";
						WebApi.putConfiguration(configuration);
					} 
	        		catch (IOException e)
	        		{
					
						e.printStackTrace();
					}
	        }
	    });
	    
	    button.setText("Send configuration");
	}

		
	private void displayVariables()
	{
	    // Create five table editors for color
	    TableEditor[] colorEditors = new TableEditor[variables.size()];

	    // Create five buttons for changing color
	    this.variablesInput = new Button[variables.size()];
	    
		  for (int i = 0; i < variables.size(); i++) 
		    {
		      final TableItem item = new TableItem(table, SWT.NONE);
		      colorEditors[i] = new TableEditor(table);
		      variablesInput[i] = new Button(table, SWT.CHECK);

		      variablesInput[i].setText(variables.get(i));
		      variablesInput[i].computeSize(SWT.DEFAULT, table.getItemHeight());

		      colorEditors[i].grabHorizontal = true;
		      colorEditors[i].minimumHeight = variablesInput[i].getSize().y;
		      colorEditors[i].minimumWidth = variablesInput[i].getSize().x;

		      colorEditors[i].setEditor(variablesInput[i], item, 0);
		
		    }
	}


	@Override
	public void setFocus() 
	{
		
	}

	
	
	@Override
	public void engineSelectionChanged(IExecutionEngine<?> engine) 
	{
		variables.clear();
		
		if (engine != null) 
		{			
				@SuppressWarnings("rawtypes")
				Set<IMultiDimensionalTraceAddon> traceAddons = engine
						.getAddonsTypedBy(IMultiDimensionalTraceAddon.class);
				
				if (!traceAddons.isEmpty()) 
				{
					@SuppressWarnings("unchecked")
					final IMultiDimensionalTraceAddon<Step<?>, State<?,?>, TracedObject<?>, Dimension<?>, Value<?>> traceAddon = traceAddons.iterator().next();
				
					final ITraceNotifier notifier = traceAddon.getTraceNotifier();
					
					final ITraceExtractor<Step<?>, State<?, ?>, TracedObject<?>, Dimension<?>, Value<?>> traceExtractor = traceAddon.getTraceExtractor();
					
					notifier.addListener(new ITraceListener() 
					{
						@Override
						public void valuesAdded(List<Value<?>> values) 
						{
							for (Value<?> value : values)
							{
								String refers = traceExtractor.getDimensionLabel((Dimension<?>) value.eContainer());
								
								System.out.println("refers"+refers);
							}
						}
						
						@Override
						public void stepsStarted(List<Step<?>> steps) {}
						
						@Override
						public void stepsEnded(List<Step<?>> steps) {}
						
						@Override
						public void statesAdded(List<State<?, ?>> states) {}
						
						@Override
						public void dimensionsAdded(List<Dimension<?>> dimensions) 
						{
							for (Dimension<?> dimension : dimensions)
							{
								variables.add(traceExtractor.getDimensionLabel(dimension));
							}
							
							Display.getDefault().asyncExec(new Runnable() 
							{
								 public void run() 
								 {
									 displayVariables();
								 }
							});
						}
					});
					
					this.traceAddon = traceAddon;
	
			} 
		
		}
	}
	

}
